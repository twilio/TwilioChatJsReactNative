'use strict';
/**
 * This exposes the native FirebaseSupportModule as a JS module. This has a
 * function 'showNotification' which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 */
import { DeviceEventEmitter, NativeModules, ToastAndroid } from "react-native";


export default class FirebaseSupport {
  static registerForPushCallback(log, client) {
    log.info('FirebaseSupportModule.JS.registerForPushCallback', 'requesting FCM token');
    NativeModules.FirebaseSupportModule.getFcmToken()
      .then((fcmToken) => {
        log.info('FirebaseSupportModule.JS.registerForPushCallback', 'got new FCM token', fcmToken);
        client.setPushRegistrationId('fcm', fcmToken);

      }).catch((err) => {
      log.error('FirebaseSupportModule.JS.registerForPushCallback', 'error while requesting FCM token', err);
    });

    DeviceEventEmitter.addListener('fcmNotificationToJs', function(e: Event) {
      log.info('FirebaseSupportModule.JS.registerForPushCallback', 'got new FCM push event', e);
      client.handlePushNotification(e);
    });
  }

  static showPushCallback(log, push) {
    log.info('FirebaseSupportModule.JS.showPushCallback', 'show notification', push);
    ToastAndroid.showWithGravity(push.body, ToastAndroid.LONG, ToastAndroid.TOP);
  }
}
