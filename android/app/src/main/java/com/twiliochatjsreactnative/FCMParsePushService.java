package com.twiliochatjsreactnative;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class FCMParsePushService extends HeadlessJsTaskService {

    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "FCMParsePush",
                    Arguments.fromBundle(extras),
                    5000,
                    true);
        }
        return null;
    }
}