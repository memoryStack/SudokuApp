import { Platform as NativePlatform, NativeModules } from 'react-native'

export class Platform {
    static isAndroid() {
        return NativePlatform.OS === 'android'
    }

    static isIOS() {
        return NativePlatform.OS === 'ios'
    }

    static OS() {
        return NativePlatform.OS
    }

    static isDebug() {
        return Platform.isAndroid() ? NativeModules.BuildConfig?.IS_DEBUG : __DEV__
    }

    static isStage() {
        return Platform.isAndroid() ? NativeModules.BuildConfig?.IS_STAGE : false
    }

    static isProd() {
        return Platform.isAndroid() ? NativeModules.BuildConfig?.IS_PROD : !__DEV__
    }

    static getBuildDetails() {
        return {
            version: Platform.isAndroid() ? '1.13' : undefined,
            versionCode: Platform.isAndroid() ? 426 : undefined,
            type: Platform.isAndroid() ? 'release' : undefined,
        }
    }
}
