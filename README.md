This is a starter PhoneGap application with a node.js builder, bower to manage javascript app dependencies, jasmine and karma for unit tests. It demonstrates the basic OAuth 2 flow required to obtain an authentication token to access OCLC web services.

<div style="width:100%; text-align:center; padding-bottom: 12px;">
<img src="https://github.com/OCLC-Developer-Network/mobile-example-one/blob/master/screen_shot.png" width=200"/>
</div>

These instructions assume you are developing on a Mac. See [Installing Cordova on Windows](https://evothings.com/doc/build/cordova-install-windows.html) for Windows installation instructions.

# Requirements

* [XCode Version 8.3 or greater](https://developer.apple.com/xcode/downloads/)
    * You only need a free apple developer account to run apps locally. However, you will need an Apple Developer account and a Developer Certificate to install to the app store ($100 fee).
* [Android Studio 2.2.2 or greater](https://developer.android.com/studio/index.html)
    * Android SDK 7.1.1 (API Level 25)
    * Tools
    * Platform-tools
    * Build-tools
* [Node Version 7.8.0](https://nodejs.org/en/) or latest.
* [npm Version 4.2.0](https://www.npmjs.com/) or latest.

## iOS Configuation

Follow the instructions at https://cordova.apache.org/docs/en/latest/guide/platforms/ios/

Note that we found it was easy to run iOS in debug mode by opening the iOS project in Xcode and setting the team name and developer profile there. Once you set it there once, it will stay set until you delete the platforms folder and do a complete rebuild.

## Android Configuration

Configure the JAVA_HOME and ANDROID_HOME environment variables.

Add $JAVA_HOME/bin, $ANDROID_HOME/platform-tools and $ANDROID_HOME/tools to your PATH environment variable.

## Configure node for local running

Add ```./node_modules/.bin``` to your PATH environment variable.

# Get authentication credentials from OCLC

To make this demo work, you will need to obtain a WSKey.

Copy ```www/js/config-example.js``` to ```www/js/config.js``` and fill in the missing configuraiton items.

See [How to Request a WSKey](https://www.oclc.org/developer/develop/authentication/how-to-request-a-wskey.en.html) for details on how to obtain the configuration parameters from OCLC for your institution.

# Installation

```git clone https://github.com/OCLC-Developer-Network/mobile-example-one```

## Build the project 

Install the entire project with this command:

```npm run build```

The above command executes these steps:

```
npm install
bower install
bower-installer
phonegap platform add android
phonegap platform add browser
phonegap platform add ios
phonegap build
```

## Build Error Troubleshooting

If you get a message like "Error code 65 for command: xcodebuild with args ..." then it means that you need to add your GroupId to the HelloWorld iOS project using XCode. Then rerun PhoneGap Build.


# Running

You can run the PhoneGap app in an attached device, an emulator or the browser.

### Browser

There are various run options:

```
phonegap run browser

phonegap emulate ios

phonegap run ios

phonegap emulate android

phonegap run android
```

# Running Unit Tests

## Unit Tests with Karma and Jasmine

```
npm run test
```

You can inspect test results by navigating your browser to:

coverage/report-html/index.html


# Other Resources

There are many ways to get started with PhoneGap.

[Getting Started with PhoneGap](http://phonegap.com/getstarted/)

[Setup PhoneGap for Android on Eclipse](http://www.tech-faq.com/setup-phonegap-for-android-on-eclipse.html)


[Using PhoneGap/Cordova with IntelliJ 2017.1](https://www.jetbrains.com/help/idea/2017.1/using-phonegap-cordova.html)
