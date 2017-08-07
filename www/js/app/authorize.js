define(["jquery", "handlebars", "config"], function($, Handlebars, config) {

    var authorizeComplete = false;
    var timeout = false;

    // this doesn't really exist in a phonegap app (except when running locally with browser),
    // we are going to catch the request below and pull off the access token.
    var redirect_uri = config.REDIRECT_URI;

    var ajaxTime;

    function _parseTokenResponse(URLhash) {

        var hash = URLhash.replace("#", "").split("&");
        var hashParams = new Object();

        for (var x = 0; x < hash.length; x++) {
            var paramArray = hash[x].split("=");
            hashParams[paramArray[0]] = paramArray[1];
        }

        return hashParams;
    }

    function _handleRedirect(url, callback) {

        var hash = url.substring(url.indexOf("#"));

        // Clear the session storage error, if there is one.
        window.sessionStorage.removeItem("error");

        // we get here if the authorization flow completes and redirects to our redirect_uri with the access token
        // on the hashed part of the url (or an error occurs)
        var tokenResponse = _parseTokenResponse(hash);

        // if we have an access token then save it away and proceed

        if (tokenResponse["access_token"]) {

            // recalculate expires_at using the offset (seconds) and current time. we subtract 1 minute for good measure
            tokenResponse["expires_at"] = (new Date()).getTime() + (tokenResponse["expires_in"] * 1000) - 60000;

            var authInstitution = tokenResponse["authenticating_institution_id"];
            var institution = tokenResponse["context_institution_id"];
            if (!authInstitution || !institution) {
                window.error({message: "institution_id_not_set", status: "institution_id_not_set", detail: ""});
                if (callback) callback();
                return;
            }

            window.sessionStorage.setItem("access_token", tokenResponse["access_token"]);
            window.sessionStorage.setItem("principalID", tokenResponse["principalID"]);
            window.sessionStorage.setItem("principalIDNS", tokenResponse["principalIDNS"]);
            window.sessionStorage.setItem("context_institution_id", tokenResponse["context_institution_id"]);
            window.sessionStorage.setItem("authenticating_institution_id", tokenResponse["authenticating_institution_id"]);
            window.sessionStorage.setItem("token_type", tokenResponse["token_type"]);
            window.sessionStorage.setItem("expires_in", tokenResponse["expires_in"]);
            window.sessionStorage.setItem("expires_at", tokenResponse["expires_at"]);

            // if we are logging in with the support institution then ask them what institution they
            // want to act on behalf of and go through the whole flow again!
            if (institution == config.SUPPORT_INSTITUTION) {
                console.log("We are logging in with the support institution!");
                if (callback) {
                    setTimeout(callback(), 1000);
                }
                return;
            }

            if (callback) {
                setTimeout(callback(), 1000);
            }

        } else {

            // Pass the error information
            window.sessionStorage.setItem("error",tokenResponse.error);
            window.sessionStorage.setItem("http_code",tokenResponse.http_code);
            window.sessionStorage.setItem("error_description",tokenResponse.error_description);
            window.sessionStorage.setItem("authenticatingInstitutionId",tokenResponse.authenticatingInstitutionId);

            if (callback) callback();

        }
        window.location.href = "index.html";
    }

    function _authorize(targetView) {

        authorizeComplete = false;
        timeout = false;

        // initiate the authorization flow.  this will either end with our redirect_uri being invoked OR an error
        // notice the targetView gets added to the state param so that we have access to it in the redirect_uri
        var location = Handlebars.compile(config.AUTH_URL)({
            wskey: config.WSKEY,
            redirect_uri: encodeURIComponent(redirect_uri),
            scope: encodeURIComponent(config.SCOPE),
            state: targetView
        });

        // Mark the start time of the authorization flow
        ajaxTime = new Date().getTime();

        // get the stored institution. if it exists pass it along to the authentication flow
        var authInstitution = config.AUTH_INSTITUTION;
        if (authInstitution && location.indexOf("&authenticatingInstitutionId") == -1) {
            location = location + "&authenticatingInstitutionId=" + authInstitution;
        }
        var institution = config.INSTITUTION;
        if (institution && location.indexOf("&contextInstitutionId") == -1) {
            location = location + "&contextInstitutionId=" + institution;
        }

        var inBrowser = document.URL.indexOf("http") === 0;
        var target = inBrowser ? "_self" : "_blank";

        var hidden = inBrowser ? "no" : "yes";

        var clearCache = false;

        var authWindow = cordova.InAppBrowser.open(location, target, "hidden=" + hidden
            + ",location=no"
            + ",toolbar=no"
            + ",enableviewportscale=yes"
            + ",disallowoverscroll=yes"
            //+ ",keyboardDisplayRequiresUserAction=no"
            + (clearCache ? ",clearcache=yes,clearsessioncache=yes" : ",clearcache=no,clearsessioncache=no"));

        // intercept each request and see if we've reached the end of the auth flow
        // when we are inBrowser (running locally) then this isn't called and we end up
        // on the redirect.html page (see it for more detail)
        authWindow.addEventListener("loadstart", function(event) {

            // hide the body as quickly as possible so we can reskin it on loadstop
            authWindow.executeScript({code: "document.body.style.display = 'none';"});

            var url = event.url.href || event.url;

            if (url.indexOf(redirect_uri) === 0) {
                authorizeComplete = true;
                _handleRedirect(url, authWindow.close);
                return;
            }

            // if it's a window/close, then do so
            if (url.indexOf("window/close") != -1) {
                authWindow.close();
                if (url.indexOf("/timeout") != -1) {
                    timeout = true;
                }
                return;
            }
        });

        authWindow.addEventListener("loadstop", function(event) {

            var url = event.url.href || event.url;

            // wayf page
            if (url.indexOf("/wayf/metaauth-ui/cmnd/protocol/samlpost") !== -1) {

                // when we get to wayf page we can show the auth window
                authWindow.show();

                // wayf error page - style it if displaying an error, otherwise just passing through
            } else if (url.indexOf("/wayf/metaauth-ui/cmnd/wayf/selectInstitution") !== -1) {

                authWindow.executeScript({code: "document.getElementsByClassName('wms-message-error').length;"}, function(result) {
                });

                // idp page
            } else if (url.indexOf("/manageduser-ui/cmnd/useraction/login") !== -1) {

                // idp error page - style it if displaying an error, otherwise just passing through
            } else if (url.indexOf("/manageduser-ui/cmnd/useraction/samllogin") !== -1) {

                authWindow.executeScript({code: "document.getElementsByClassName('uic-error').length;"}, function(result) {
                });

                // authorize page - style it the 2nd time through
            } else if (url.indexOf("/wskeyws/authorize.jsp") !== -1) {

                // ignore pages - don't do anything
            } else if (url.indexOf("/wayf/metaauth-ui/cmnd/protocol/acs/saml2") !== -1) {

                // ignore

                // unknown pages - set a timeout to expire the page
            } else {

                authWindow.executeScript({code: "setTimeout(function() { window.location.href = 'window/close/timeout'; }, 10000);"});
            }
        });

        authWindow.addEventListener("loaderror", function(event) {

            // the redirect back to localhost should not be considered an error (and we should not show it)
            if (event.url && event.url.indexOf(redirect_uri) === 0) {
                authWindow.executeScript({code: "document.write(''); document.close();"});
                return;
            }

            authorizeComplete = true;
            authWindow.close();
            window.error({message: event.type, status: event.code, detail: event.message});
        });

        authWindow.addEventListener("exit", function(event) {

            // if oauth2 flow timed out
            if (timeout) {
                window.error({message: "loaderror"});
                return;
            }

            // if the authorize never completed then redirect back to the login screen
            if (!authorizeComplete) {
                return;
            }
        });
    }

    return {

        authorize: _authorize,

        // exposed so that when we are running under a local browser and redirect.html is hit we can handle it
        handleRedirect: function(hash) {
            _handleRedirect(redirect_uri + hash);
        },

        // exposed for unit testing purposes
        parseTokenResponse: _parseTokenResponse
    }
});
