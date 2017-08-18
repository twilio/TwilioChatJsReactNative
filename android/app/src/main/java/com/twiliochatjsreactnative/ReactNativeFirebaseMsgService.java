package com.twiliochatjsreactnative;

import android.content.Intent;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class ReactNativeFirebaseMsgService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Intent i = new Intent("com.twiliochatjsreactnative.onFcmMessage");
        i.putExtra("data", remoteMessage);
        sendBroadcast(i, null);
    }
}