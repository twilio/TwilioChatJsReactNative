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

### Receiving FCM pushes
Twilio Chat and Twilio Notify are sending FCM pushes as [data messages](https://firebase.google.com/docs/cloud-messaging/concept-options) only, without standard notification payload to show in notification area. 

Data messages are silent notifications that do not raise an alert in the notification tray but instead wake the app up in the background and allow it to process the notification and potentially raise a local notification. Data messages are typically preferred by Android developers for two reasons: 
* The aesthetics of Android default alert notifications rendered by the OS often does not match the developer's expectations
* When a user taps an alert or hybrid notification the app is not launched unless a click_action is specified


Unfortunately, React Native does not have an API to display local notifications on Android, so, developer can choose to show notification in android notification area with some react's 3rd party libs (like, [react-native-push-notification](https://github.com/zo0r/react-native-push-notification)) or natively with Java code. 

In both cases before displaying the notification, developer has to parse FCM data push to extract data he needs to show:
* In case of using JavaScript libraries for displaying local notifications developer can use Twilio Chat JavaScript static method [Client.parsePushNotification](http://media.twiliocdn.com/sdk/js/chat/releases/2.1.0/docs/Client.html#.parsePushNotification__anchor) to parse push and get the data he needs. Example of calling the static JavaScript method from FirebaseService implementation is shown in this example([invoking service to bridge native Java and JavaScript](android/app/src/main/java/com/twiliochatjsreactnative/ReactNativeFirebaseMsgService.java#L29), [calling JavaScript](android/app/src/main/java/com/twiliochatjsreactnative/FCMParsePushService.java), [registering JavaScript methods for service](index.android.js#L54) and [JavaScript method body](js/FCMParsePush.js))
* Case of using native Android Java to display local notification is shown in this Twilio Chat React Native demo. Developer should register the [FirebaseService](android/app/src/main/java/com/twiliochatjsreactnative/ReactNativeFirebaseMsgService.java), parse the push by himself ([TwilioFCMNotificationPayload.java](android/app/src/main/java/com/twiliochatjsreactnative/TwilioFCMNotificationPayload.java) is example of doing this parsing) and display it through NotificationManager as shown [here](android/app/src/main/java/com/twiliochatjsreactnative/ReactNativeFirebaseMsgService.java#L37).
 
## Token provider and Chat configuration
Token is provided by locally running [express.js app](app.js). The app uses ngrok to expose the token provider to the internet - be careful with exposing your actual credentials and secrets to the internet.

Configuration for token provider and chat library are stored in the `configuration.json` file. The example with correct structure can be learned from [configuration.example.json](configuration.example.json):
* `chatClient` holds the key `options`. Those are options for Chat client creation, passed as [ClientOptions](http://media.twiliocdn.com/sdk/js/chat/releases/1.2.0/docs/Client.html#ClientOptions) described in Twilio Programmable Chat documentation. 
* `tokenGenerator` contains keys needed for token composition (`accountSid`, `signingKeySid`, `signingKeySecret` and `serviceSid` keys) and Credential SIDs for APN and FCM you've created earlier (`fcm` and `apn` keys). 
* `ngrok` structure configures ngrok:
    * set `subdomain` if you want to start ngrok with predefined subdomain for token generation
    * set `basicAuth` structure if you want your token generator to be password-protected (which is strongly encouraged by Twilio)
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
  "ngrok": {
    "subdomain": "somengroksubdomain",
    "basicAuth": {
      "username": "someusername",
      "password": "somepassword"
    }
  }
}
```

Token provider runs on port `3002` on `localhost` and is exposed to the internet with `ngrok` help.

Token provider has multiple exposed endpoints:
 * http://localhost:3002/chat-client-configuration.json (and `http://<yourngroksubdomain>.ngrok.io/chat-client-configuration.json`) your Chat configuration in json format
 * http://localhost:3002/token (and `http://<yourngroksubdomain>.ngrok.io/token`) token generator GET endpoint, takes in query parameters `identity` and `pushChannel` (`fcm` or `apns`)

Additionally, ngrok exposes it's own status and inspect endpoint at http://localhost:4040

## Running the app
1. do the push registration and do all the necessary iOS and Android projects adjustments
2. check and fill in the `configuration.json`
3. do the `npm install`
4. run token provider: `npm run token-provider` (you can check your configuration values via http://localhost:3002/configuration)
5. build and run React Native app

## TODO
* pass full push payload from APN to Chat lib (currently reconstructing the json on the fly) [here](js/ApnsSupportModule.js)
