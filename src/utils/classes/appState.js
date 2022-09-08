
import { AppState as NativeAppState } from "react-native";

import { EVENTS } from "../../constants/events";

import { Platform } from "./platform";

const COMMON_EVENTS = [EVENTS.APP_STATE.CHANGE]

const IOS_EVENTS = [...COMMON_EVENTS]

const ANDROID_EVENTS = [...COMMON_EVENTS, EVENTS.APP_STATE.BLUR, EVENTS.APP_STATE.FOCUS]

export class AppState {
    static addListener(eventName, handler) {
        if (!AppState.isValidEventName(eventName)) {
            throw new Error(`<${eventName}> is not a valid event for ${Platform.OS()} platform`)
        }
        NativeAppState.addEventListener(eventName, handler)
    }

    static isValidEventName(eventName) {
        if (Platform.isAndroid()) return ANDROID_EVENTS.includes(eventName)
        return IOS_EVENTS.includes(eventName)
    }

    static removeListener(eventName, handler) {
        NativeAppState.removeEventListener(eventName, handler)
    }

    static currentState() {
        return NativeAppState.currentState
    }
}
