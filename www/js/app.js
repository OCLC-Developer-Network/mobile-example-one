define(["app/authorize", "jquery"], function(authorize, $) {

    function _displayToken() {
        var accessTokenProperties = $(".access-token-properties");

        accessTokenProperties.append("<div class='key'>access_token</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("access_token") + "</div>");
        accessTokenProperties.append("<div class='key'>principalID</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("principalID") + "</div>");
        accessTokenProperties.append("<div class='key'>principalIDNS</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("principalIDNS") + "</div>");
        accessTokenProperties.append("<div class='key'>context_institution_id</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("context_institution_id") + "</div>");
        accessTokenProperties.append("<div class='key'>authenticatin_institution_id</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("authenticating_institution_id") + "</div>");
        accessTokenProperties.append("<div class='key'>token_type</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("token_type") + "</div>");
        accessTokenProperties.append("<div class='key'>expires_in</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("expires_in") + "</div>");
        accessTokenProperties.append("<div class='key'>expires_at</div>" +
            "<div class='value'>" + window.sessionStorage.getItem("expires_at") + "</div>");
    }

    return {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            console.log("*** onDeviceReady");
            console.log(window.location.href);
            if (window.location.href.indexOf("access_token") !== -1) {
                console.log("*** handleRedirect");
                authorize.handleRedirect(window.location.href);
            }
            if (window.sessionStorage.getItem("access_token")) {
                console.log("*** _displayToken()");
                _displayToken();
            }
            $(".auth-button").on("click", function() {
                console.log("**** auth-button click");
                authorize.authorize("");
            });
        }
    }
});



