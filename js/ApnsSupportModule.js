'use strict';
import { AlertIOS, PushNotificationIOS } from "react-native";


export default class ApnsSupport {

  static registerForPushCallback(log, client) {
    log.info('ApnsSupportModule.JS.registerForPushCallback', 'requesting APN token');

    PushNotificationIOS.addEventListener(`register`, function(token) {
      log.info('ApnsSupportModule.JS.registerForPushCallback', 'got new APN token', token);
      client.setPushRegistrationId('apn', token);
    });

    PushNotificationIOS.addEventListener(`registrationError`, function(err) {
      log.error('ApnsSupportModule.JS.registerForPushCallback', 'error registering for notifications', err);
    });

    PushNotificationIOS.addEventListener('notification', function(notification) {
        // TODO: here we need to pass the full `raw` notification to the Chat library.
        // however, I couldn't find the way to get the raw json from APN notification in react native,
        // so, I had to construct the payload again. Send in PRs if you know the right way :)
        log.info('ApnsSupportModule.JS.registerForPushCallback', 'got new APN push event', notification);
        let rawNotification: Object = Object.assign(notification._data);
        Object.assign(rawNotification, { aps: { alert: notification.getAlert() } });
        if (typeof notification._badgeCount !== 'undefined') {
          PushNotificationIOS.setApplicationIconBadgeNumber(notification._badgeCount);
          Object.assign(rawNotification, { aps: { sound: notification._badgeCount } });
        }
        if (typeof notification._sound !== 'undefined') {
          Object.assign(rawNotification, { aps: { badge: notification._sound } });
        }
        log.info('ApnsSupportModule.JS.registerForPushCallback', 'formed RAW notification', rawNotification);
        client.handlePushNotification(rawNotification);
      }
    );

    PushNotificationIOS.requestPermissions()
      .then((permissions) => {
        log.info('ApnsSupportModule.JS.registerForPushCallback', 'successfully requested permissions', permissions);
      }).catch(err => {
      log.error('ApnsSupportModule.JS.registerForPushCallback', 'error while requesting permissions', err);
    });


  }

  static showPushCallback(log, push) {
    log.info('ApnsSupportModule.JS.showPushCallback', 'show notification', push);
    AlertIOS.alert(
      push.messageType,
      push.body
    );
  }
}
