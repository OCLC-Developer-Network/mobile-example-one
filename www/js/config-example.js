define(function() {

    var config = {};

    config.WSKEY = "YOUR WSKEY GOES HERE";
    config.SCOPE = "WMS_CIRCULATION configPlatform";
    config.REDIREC_URI = "http://localhost:8000/redirect.html";
    config.TARGET = "app/";
    config.AUTH_INSTITUTION = 128807;
    config.CONTEXT_INSTITUTION = 128807;

    config.AUTH_URL_BASE = "https://authn.sd00.worldcat.org/oauth2/authorizeCode";
    config.AUTH_URL = config.AUTH_URL_BASE + "?client_id={{wskey}}" +
        "&redirect_uri={{{redirect_uri}}}" +
        "&response_type=token" +
        "&scope={{{scope}}}" +
        "&state={{{state}}}";

    return config;
});
