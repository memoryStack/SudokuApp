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
        console.log('@@@@@@@@@ xx resetttt', currentConfig, prevAnimationTransition)
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

/*
    ### **CSS Properties That Support `useNativeDriver: true` (GPU-Accelerated)**
    These properties can be animated on the native thread (non-JS thread) for better performance:

    1. **Layout Properties**:
    - `transform` (all sub-properties):
        - `translateX` (`{ transform: [{ translateX: animatedValue }] }`)
        - `translateY` (`{ transform: [{ translateY: animatedValue }] }`)
        - `scale` (`{ transform: [{ scale: animatedValue }] }`)
        - `scaleX`/`scaleY` (`{ transform: [{ scaleX: animatedValue }] }`)
        - `rotate` (`{ transform: [{ rotate: '45deg' }] }`)
        - `rotateX`/`rotateY` (for 3D transforms, if supported)
    - `opacity` (`{ opacity: animatedValue }`)

    2. **Shadow Properties (iOS only)**:
    - `shadowOpacity` (iOS)
    - `shadowRadius` (iOS)
    - `shadowOffset` (iOS, but must be static)

    3. **Overlay Properties**:
    - `backgroundColor` (Android only, with `useNativeDriver: true` in newer RN versions)

    ---

    ### **CSS Properties That Are JS-Driven (Cannot Use `useNativeDriver: true`)**
    These properties run on the JavaScript thread (slower, can cause frame drops):

    1. **Layout Properties**:
    - `width` (`{ width: animatedValue }`)
    - `height` (`{ height: animatedValue }`)
    - `top`/`bottom`/`left`/`right` (`{ top: animatedValue }`)
    - `margin`/`padding` and their variants (`marginTop`, `paddingLeft`, etc.)
    - `flex` (`{ flex: animatedValue }`)
    - `borderRadius` (`{ borderRadius: animatedValue }`)

    2. **Text & Font Properties**:
    - `fontSize` (`{ fontSize: animatedValue }`)
    - `color` (text color, unless using `Animated.Text` with `useNativeDriver: true` in newer versions)
    - `lineHeight` (`{ lineHeight: animatedValue }`)

    3. **Border Properties**:
    - `borderWidth` (`{ borderWidth: animatedValue }`)
    - `borderColor` (unless using `Animated.Text` or `Animated.View` with workarounds)

    4. **Background & Overlay Properties**:
    - `backgroundColor` (on iOS, unless using a workaround)
    - `zIndex` (`{ zIndex: animatedValue }`)

    ---

    ### **Best Practices for `useNativeDriver`**
    1. **Always prefer `useNativeDriver: true`** when possible (for `transform`, `opacity`, and iOS shadows).
    2. **Avoid animating layout properties** (`width`, `height`, `margin`, `padding`) if performance is critical.
    3. **For `backgroundColor` animation**:
    - On **Android**, it works with `useNativeDriver: true` in newer RN versions.
    - On **iOS**, you need a workaround (e.g., overlaying an opaque view with `opacity` animation).
    4. **For text color changes**, use `Animated.Text` with `color` interpolation if supported.

*/