define(["app/levelDisplay"], function(levelDisplay) {

    return {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        },
        onDeviceReady: function() {
            levelDisplay.go();
        }
    };
});


