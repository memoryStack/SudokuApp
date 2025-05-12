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
    public static String VERSION = BuildConfig.VERSION_NAME;
    public static int VERSION_CODE = BuildConfig.VERSION_CODE;
    public static String BUILD_TYPE = BuildConfig.BUILD_TYPE;

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
        constants.put("VERSION", VERSION);
        constants.put("VERSION_CODE", VERSION_CODE);
        constants.put("BUILD_TYPE", BUILD_TYPE);
        return constants;
    }
}
