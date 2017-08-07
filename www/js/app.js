define(["app/authorize","jquery"], function(authorize,$) {

    console.log("*** app.js ***");

    return {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            $(".auth-button").on("click",function(){
                authorize.authorize("");
            });
        }
    };
});


