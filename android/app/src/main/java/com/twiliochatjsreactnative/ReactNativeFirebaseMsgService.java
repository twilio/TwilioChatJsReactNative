package com.twiliochatjsreactnative;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import com.facebook.react.bridge.*;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.twiliochatjsreactnative.TwilioFCMNotificationPayload;

public class ReactNativeFirebaseMsgService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.i("ReactNativeFirebaseMsgService", "got new remote message");
        Bundle bundle = remoteMessageToBundle(remoteMessage);
        Intent i = new Intent("com.twiliochatjsreactnative.onFcmMessage");
        i.putExtras(bundle);
        sendBroadcast(i, null);

        // TwilioFCMNotificationPayload is a helper class to parser Twilio Notify's FCM notification
        // more info see here: https://www.twilio.com/
        displayPushInNotififcationArea(new TwilioFCMNotificationPayload(bundle));

//        if you want to send the raw push to the JS library to reparse
//        (while app is not running), you can use this react native pattern to call static JS method
//
//        Intent service = new Intent(getApplicationContext(), FCMParsePushService.class);
//        service.putExtras(bundle);
//        getApplicationContext().startService(service);
    }

    private void displayPushInNotififcationArea(TwilioFCMNotificationPayload notificationPayload) {
        Log.i("ReactNativeFirebaseMsgService", "Got notification to display: " + notificationPayload.toString());

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0, new NotificationCompat.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("TwilioChatJSReactNative")
                .setContentText(notificationPayload.getBody())
                .build());
    }

    private Bundle remoteMessageToBundle(RemoteMessage remoteMessage) {
        Bundle bundle = new Bundle();
        bundle.putString("collapse_key", remoteMessage.getCollapseKey());
        bundle.putString("from", remoteMessage.getFrom());
        bundle.putString("google.message_id", remoteMessage.getMessageId());
        bundle.putDouble("google.sent_time", remoteMessage.getSentTime());
        if (remoteMessage.getData() != null) {
            Bundle data = new Bundle();
            for (String key : remoteMessage.getData().keySet()) {
                data.putString(key, remoteMessage.getData().get(key));
            }
            bundle.putBundle("data", data);
        }
        return bundle;
    }
}
