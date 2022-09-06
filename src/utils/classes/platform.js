import { Platform } from "react-native";

export class Platform {
    static isAndriod() {
        return Platform.OS === 'android'
    }

    static isIOS() {
        return Platform.OS === 'ios'
    }
}