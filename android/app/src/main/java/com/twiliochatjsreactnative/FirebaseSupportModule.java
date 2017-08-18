package com.twiliochatjsreactnative;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.Set;

public class FirebaseSupportModule extends ReactContextBaseJavaModule {


    public FirebaseSupportModule(ReactApplicationContext reactContext) {
        super(reactContext);
        registerOnFcmMessageReceiver();
    }

    public void registerOnFcmMessageReceiver() {
        final FirebaseSupportModule firebaseSupportModule = this;
        IntentFilter intentFilter = new IntentFilter("com.twiliochatjsreactnative.onFcmMessage");
        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                RemoteMessage message = intent.getParcelableExtra("data");
                firebaseSupportModule.emitFcmNotificationToJs(message);
            }
        }, intentFilter);
    }

    @Override
    public String getName() {
        return "FirebaseSupportModule";
    }

    private void emitFcmNotificationToJs(RemoteMessage remoteMessage) {
        WritableMap params = Arguments.createMap();
        //params = Arguments.fromBundle(extras);
        params.putString("collapse_key", remoteMessage.getCollapseKey());
        params.putString("from", remoteMessage.getFrom());
        params.putString("google.message_id", remoteMessage.getMessageId());
        params.putDouble("google.sent_time", remoteMessage.getSentTime());

        if (remoteMessage.getData() != null) {
            WritableMap dataMap = Arguments.createMap();
            Map<String, String> data = remoteMessage.getData();
            Set<String> keysIterator = data.keySet();
            for (String key : keysIterator) {
                dataMap.putString(key, data.get(key));
            }
            params.putMap("data", dataMap);
        }

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("fcmNotificationToJs", params);
    }

    @ReactMethod
    public void getFcmToken(Promise promise) {
        if (FirebaseInstanceId.getInstance().getToken() != null) {
            promise.resolve(FirebaseInstanceId.getInstance().getToken());
        } else {
            promise.reject("No token available");
        }
    }
}