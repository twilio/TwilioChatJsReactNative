package com.twiliochatjsreactnative;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;

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
                Bundle extras = intent.getExtras();
                getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("fcmNotificationToJs", Arguments.fromBundle(intent.getExtras()));
            }
        }, intentFilter);
    }

    @Override
    public String getName() {
        return "FirebaseSupportModule";
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