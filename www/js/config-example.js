/**
 * Copy this file to config.js and enter your authentication parameters.
 */
define(function() {

    var config = {};

    config.WSKEY = ""; // YOUR WSKEY CLIENT ID
    config.REDIRECT_URI = "http://localhost:8000/redirect.html";
    config.AUTH_INSTITUTION = 0 //YOUR INSTITUTION ID NUMBER;
    config.INSTITUTION = 0 // YOUR AUTHENTICATING INSTITUTION - PROBABLY SAME AS ABOVE;
    config.SCOPE = "WMS_CIRCULATION configPlatform"; // SERVICES TO AUTHENTICATE ACCESS TO
    config.TARGET = ""; // RETURNED ALONG WITH THE TOKEN - CAN USE TO NAVIGATE TO DESIRED PAGE OR LEAVE EMPTY

    config.AUTH_URL_BASE = "https://authn.sd00.worldcat.org/oauth2/authorizeCode"; // AUTHENTICATION BASE URL
    config.AUTH_URL = config.AUTH_URL_BASE + "?client_id={{wskey}}" + // AUTHENTICATION PARAMETERS
        "&redirect_uri={{{redirect_uri}}}" +
        "&response_type=token" +
        "&scope={{{scope}}}" +
        "&state={{{state}}}";

    return config;
});
