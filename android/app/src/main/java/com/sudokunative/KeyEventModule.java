package com.sudokunative;

import android.view.KeyEvent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.app.Activity;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = "KeyEventModule")
public class KeyEventModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public KeyEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "KeyEventModule";
    }

    public void onKeyDown(int keyCode, KeyEvent event) {
        WritableNativeMap params = new WritableNativeMap();
        params.putInt("keyCode", keyCode);
        params.putString("key", KeyEvent.keyCodeToString(keyCode));
        
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onKeyDown", params);
    }

    @ReactMethod
    public void registerKeyEventModule() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity instanceof MainActivity) {
            ((MainActivity) currentActivity).setKeyEventModule(this);
        }
    }
}
