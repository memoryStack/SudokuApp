import { Platform as NativePlatform } from "react-native";
export class Platform {
    static isAndroid() {
        return NativePlatform.OS === 'android'
    }

    static isIOS() {
        return NativePlatform.OS === 'ios'
    }
}
