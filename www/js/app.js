define(["app/authorize", "jquery"], function(authorize, $) {

    function _displayToken(tokenResponseString) {
        var accessTokenDisplay = $(".access-token"),
            json = JSON.parse(tokenResponseString);

        for (var key in json) {
            accessTokenDisplay.append("<div class='key'>" + key + "</div>" +
                "<div class='value'>" + json[key] + "</div>");
        }
    }

    function _displayError(errorResponseString) {
        var errorResponseDisplay = $(".error-response"),
            errorKeys = ["error", "http_code", "error_description", "authenticatingInstitutionId"],
            json = JSON.parse(errorResponseString);

        for (var i = 0; i < errorKeys.length; i++) {
            errorResponseDisplay.append("<div class='key'>" + errorKeys[i] + "</div>" +
                "<div class='value'>" + json[errorKeys[i]] + "</div>");
        }
    }

    return {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            var tokenResponseString = window.sessionStorage.getItem("token_response"),
                errorResponseString = window.sessionStorage.getItem("error_response");

            console.log("onDeviceReady");

            // When running the app in development mode in a browser, you need to call the redirect logic
            // in app.js manually.
            if (window.location.href.indexOf("access_token") !== -1) {
                authorize.handleRedirect(window.location.href);
            }

            // If we are coming to this page after authentication, either the tokenResponseString or the
            // errorResponseString will be set in session storage.
            if (tokenResponseString) {
                _displayToken(tokenResponseString);
            }
            if (errorResponseString) {
                _displayError(errorResponseString);
            }

            // Event handlers
            $(".auth-button").on("click", function() {
                authorize.authorize("");
            });
        }
    }
});



