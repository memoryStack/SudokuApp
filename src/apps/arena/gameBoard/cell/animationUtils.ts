import { Animated } from 'react-native'

import _isNil from '@lodash/isNil'

const DEFAULT_TIME_TO_RESET = 300

export enum ANIMATABLE_PROPERTIES {
    BG_COLOR = 'bgColor',
    FONT_SIZE = 'fontSize',
    TEXT_COLOR = 'textColor',
}

type NativeAnimationConfig = Animated.TimingAnimationConfig
    | Animated.DecayAnimationConfig
    | Animated.SpringAnimationConfig
    | Animated.LoopAnimationConfig

type AnimationConfig = {
    resetToPrevious?: boolean,
    config: NativeAnimationConfig
}

const EMPTY_ANIMATION_CONFIG = {
    config: {}
}

const JS_DRIVEN_ANIMATION_PROPERTIES = [
    ANIMATABLE_PROPERTIES.TEXT_COLOR,
    ANIMATABLE_PROPERTIES.BG_COLOR
]

const shouldUseNativeDriver = (propertyToAnimate: ANIMATABLE_PROPERTIES) => {
    return !JS_DRIVEN_ANIMATION_PROPERTIES.includes(propertyToAnimate)
}

// TODO: fix this error
const getNativeDriverValue = (config: NativeAnimationConfig = {}, propertyToAnimate: ANIMATABLE_PROPERTIES) => {
    return !_isNil(config.useNativeDriver) ? config.useNativeDriver : shouldUseNativeDriver(propertyToAnimate)
}

// TODO: get the animated property as well to know the useNativeDriver's default here
// if in config the value is not passed
export const createAnimationInstance = (
    animatedValue: Animated.Value,
    originalAnimatedValueBeforeAnimationStarted: number,
    propertyToAnimate: ANIMATABLE_PROPERTIES,
    currentConfig: AnimationConfig = EMPTY_ANIMATION_CONFIG
) => {
    if (currentConfig.resetToPrevious) {
        // animatedValue.stopAnimation() // uncommenting it didn't make any difference
        return Animated.timing(animatedValue, {
            ...currentConfig.config,
            toValue: originalAnimatedValueBeforeAnimationStarted,
            duration: currentConfig.config?.duration || DEFAULT_TIME_TO_RESET,
            useNativeDriver: getNativeDriverValue(currentConfig.config, propertyToAnimate) // TODO: send the property config here
        })
    }
    return Animated.timing(animatedValue, {
        ...currentConfig.config,
        useNativeDriver: getNativeDriverValue(currentConfig.config, propertyToAnimate) // TODO: send the property config here
    })
}
