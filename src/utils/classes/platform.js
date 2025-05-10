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
}
