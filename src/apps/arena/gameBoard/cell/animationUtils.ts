import { Animated } from 'react-native'

import _isNil from '@lodash/isNil'

const DEFAULT_TIME_TO_RESET = 300

export enum ANIMATABLE_PROPERTIES {
    BG_COLOR = 'bgColor',
    FONT_SIZE = 'fontSize',
    TEXT_COLOR = 'textColor',
    BORDER_WIDTH = 'borderWidth',
    BORDER_COLOR = 'borderColor',
    OPACITY = 'opacity',
}

type NativeAnimationConfig = Animated.TimingAnimationConfig
    | Animated.DecayAnimationConfig
    | Animated.SpringAnimationConfig
    | Animated.LoopAnimationConfig

type AnimationConfig = {
    resetToPrevious?: boolean,
    loopConfig?: any,
    config: NativeAnimationConfig
}

const EMPTY_ANIMATION_CONFIG = {
    config: {}
}

const JS_DRIVEN_ANIMATION_PROPERTIES = [
    ANIMATABLE_PROPERTIES.FONT_SIZE,
    ANIMATABLE_PROPERTIES.TEXT_COLOR,
    ANIMATABLE_PROPERTIES.BG_COLOR,
    ANIMATABLE_PROPERTIES.BORDER_COLOR,
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
    prevAnimationTransition: { from: number, to: number },
    propertyToAnimate: ANIMATABLE_PROPERTIES,
    currentConfig: AnimationConfig = EMPTY_ANIMATION_CONFIG
) => {
    if (currentConfig.resetToPrevious) {
        // uncommenting the below line doesn't make any difference
        // animatedValue.stopAnimation()
        return Animated.timing(animatedValue, {
            ...currentConfig.config,
            toValue: prevAnimationTransition.from,
            duration: currentConfig.config?.duration || DEFAULT_TIME_TO_RESET,
            useNativeDriver: getNativeDriverValue(currentConfig.config, propertyToAnimate) // TODO: send the property config here
        })
    }

    if (currentConfig.loopConfig) {
        return Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, currentConfig.config),
                Animated.timing(animatedValue, {
                    ...currentConfig.config,
                    toValue: prevAnimationTransition.to,
                }),
            ]), currentConfig.loopConfig)
    }

    return Animated.timing(animatedValue, {
        ...currentConfig.config,
        useNativeDriver: getNativeDriverValue(currentConfig.config, propertyToAnimate) // TODO: send the property config here
    })
}
