# TwilioChatJsReactNative
This repository contains example React Native app with Twilio Programmable Chat client usage.
App is running on both iOS and Android (full functionality with FCM and APN pushes including).

## Chat functionality
The Chat part is currently wrapped in helper [chat-client-helper.js](js/chat-client-helper.js). The client subscribes to all events which Chat library emits, logs it in console and shows on screen once user is logged in.

## Pushes
You will have to create the FCM and APN credentials and certificates by yourself and pass it respectively in iOS and Android projects (through xcode in the iOS project and through `google-services.json` for Android).

You will need to create credentials in the [Twilio Console](www.twilio.com/console/chat/credentials) with created certificates and app identifiers and store it in `configuration.json` file. 

The helper modules for APN registration and FCM registration are [ApnsSupportModule](js/ApnsSupportModule.js) and [FirebaseSupportModule](js/FirebaseSupportModule.js). The Android FCM wiring is done in native Java code inside [Android project](android/app). 

Keep in mind, that to send pushes you have to turn on the push features for your service instance via [Twilio Console](www.twilio.com/console/chat) 

## Token provider and Chat configuration
Token is provided by locally running [express.js app](app.js). The app uses ngrok to expose the token provider to the internet - be careful with exposing your actual credentials and secrets to the internet.

Configuration for token provider and chat library are stored in the `configuration.json` file. The example with correct structure can be learned from [configuration.example.json](configuration.example.json):
* `chatClient` holds the key `options`. Those are options for Chat client creation, passed as [ClientOptions](http://stage.twiliocdn.com/sdk/js/chat/releases/1.1.0-rc2/docs/Client.html#ClientOptions) described in Twilio Programmable Chat documentation. 
* `tokenGenerator` contains keys needed for token composition (`accountSid`, `signingKeySid`, `signingKeySecret` and `serviceSid` keys) and Credential SIDs for APN and FCM you've created earlier (`fcm` and `apn` keys). 
* `ngrokSubdomain` is optional field if you want to start ngrok with predefined subdomain for token generation
```
{
  "chatClient": { 
    "options": {
      "logLevel": "info"
    }
  },
  "tokenGenerator": {
    "accountSid": "ACxxx",
    "signingKeySid": "SKxxx",
    "signingKeySecret": "xxx",
    "serviceSid": "ISxxx",
    "fcm": "CRxxx",
    "apns": "CRxxx"
  },
  "ngrokSubdomain": "somengroksubdomain"
}
```

Token provider runs on port `3002` on `localhost` and is exposed to the internet with `ngrok` help.

Token provider has multiple exposed endpoints:
 * http://localhost:3002/chat-client-configuration.json (and `http://<yourngroksubdomain>.ngrok.io/chat-client-configuration.json`) your Chat configuration in json format
 * http://localhost:3002/token (and `http://<yourngroksubdomain>.ngrok.io/token`) token generator GET endpoint, takes in query parameters `identity` and `pushChannel` (`fcm` or `apns`)
 * http://localhost:3002/configuration (and `http://<yourngroksubdomain>.ngrok.io/configuration`) exposes full `configuration.json` for debugging the app

Additionally, ngrok exposes it's own status and inspect endpoint at http://localhost:4040

## Running the app
1. do the push registration and do all the necessary iOS and Android projects adjustments
2. check and fill in the `configuration.json`
3. do the `npm install`
4. run token provider: `npm run token-provider` (you can check your configuration values via http://localhost:3002/configuration)
5. build and run React Native app

## TODO
* pass full push payload from APN to Chat lib (currently reconstructing the json on the fly) [here](js/ApnsSupportModule.js)
