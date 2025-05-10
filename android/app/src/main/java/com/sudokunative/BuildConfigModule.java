package com.sudokunative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.annotation.SuppressLint;

@ReactModule(name = "BuildConfig")
public class BuildConfigModule extends ReactContextBaseJavaModule {
    
    public static boolean IS_DEBUG = BuildConfig.IS_DEBUG;
    public static boolean IS_STAGE = BuildConfig.IS_STAGE;
    public static boolean IS_PROD = BuildConfig.IS_PROD;

    BuildConfigModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "BuildConfig";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("IS_DEBUG", IS_DEBUG);
        constants.put("IS_STAGE", IS_STAGE);
        constants.put("IS_PROD", IS_PROD);
        return constants;
    }
}
