import { Animated } from "react-native"
import { useEffect, useRef } from "react"

import _merge from "@lodash/merge"

import { usePrevious } from "@utils/customHooks"

import { ANIMATABLE_PROPERTIES, createAnimationInstance } from "./animationUtils"
import _isEmpty from "@lodash/isEmpty"

const DEFAULT_ANIM_VALUES: Record<ANIMATABLE_PROPERTIES, any> = {
    [ANIMATABLE_PROPERTIES.FONT_SIZE]: 1,
    [ANIMATABLE_PROPERTIES.TEXT_COLOR]: 0,
    [ANIMATABLE_PROPERTIES.BG_COLOR]: 0,
    [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: 0,
    [ANIMATABLE_PROPERTIES.BORDER_COLOR]: 0,
    [ANIMATABLE_PROPERTIES.OPACITY]: 1,
}

const getInitialToAndFromValues = (animInitialValues) => {
    return Object.values(ANIMATABLE_PROPERTIES).reduce((result, property) => {
        if (property in animInitialValues) {
            result[property] = {
                from: DEFAULT_ANIM_VALUES[property],
                to: animInitialValues[property]
            }
        } else {
            result[property] = {
                from: DEFAULT_ANIM_VALUES[property],
                to: DEFAULT_ANIM_VALUES[property],
            }
        }
        return result
    }, {})
}

const debounce = (func, delay) => {
    return func
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const useAnimateView = (cellAnimationsConfig, animInitialValues = {}, cell = false) => {

    const originalAnimatedValuesBeforeAnimationStarted = useRef(getInitialToAndFromValues(animInitialValues)).current

    const mainNumberFontAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.FONT_SIZE].to)).current
    const mainNumberColorAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.TEXT_COLOR].to)).current
    const bgColorAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.BG_COLOR].to)).current
    const borderWidthAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.BORDER_WIDTH].to)).current
    const borderColorAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.BORDER_COLOR].to)).current
    const opacityAnim = useRef(new Animated.Value(originalAnimatedValuesBeforeAnimationStarted[ANIMATABLE_PROPERTIES.OPACITY].to)).current

    const ANIMATED_PROPERTY_VS_ANIM_VALUE = {
        [ANIMATABLE_PROPERTIES.FONT_SIZE]: mainNumberFontAnim,
        [ANIMATABLE_PROPERTIES.TEXT_COLOR]: mainNumberColorAnim,
        [ANIMATABLE_PROPERTIES.BG_COLOR]: bgColorAnim,
        [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: borderWidthAnim,
        [ANIMATABLE_PROPERTIES.BORDER_COLOR]: borderColorAnim,
        [ANIMATABLE_PROPERTIES.OPACITY]: opacityAnim,
    }

    const animationObj = useRef({})

    const animationConfigsMerge = useRef({})

    animationConfigsMerge.current = _merge(animationConfigsMerge.current, cellAnimationsConfig)

    useEffect(() => {
        const allAnimations = animationConfigsMerge.current
        cell && cell.row === 0 && cell.col === 1 && console.log('@@@@@@ all animations', allAnimations)
        Object.keys(allAnimations).forEach((animatableProperty) => {
            // TODO: add check for animatableProperty if that's supported or not
            if (allAnimations[animatableProperty].stop) {
                const animationInstance = animationObj.current[animatableProperty]
                animationInstance && animationInstance.stop()
            } else if (allAnimations[animatableProperty].start) {
                const animationInstance = animationObj.current[animatableProperty]
                animationInstance && animationInstance.start()
            } else {
                // add safety checks in case animation instance is not returned
                const animation = createAnimationInstance(
                    ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty],
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty],
                    animatableProperty,
                    allAnimations[animatableProperty] // this is the config
                )

                // WARN: don't move the below .from update logic above createAnimationInstance function
                if (originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to !== -1) {
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].from
                        = originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to
                }

                animation.start()

                animationObj.current[animatableProperty] = animation

            }

            ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty].addListener(({ value }) => {
                if (!Number.isNaN(value)) {
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to = value
                }
            })
        })

        return () => {
            Object.keys(allAnimations).forEach((animatableProperty) => {
                const animatedValue = ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty]
                animatedValue.stopAnimation((currentValue) => {
                    animatedValue.setValue(currentValue)
                })
                animatedValue.removeAllListeners()
            })
        }
    }, [cell && cell?.row, cell && cell?.col, cellAnimationsConfig])

    // this below should be configured properly from platform independent code to platform dependent code.
    const mainNumberColorInterpolation = animationConfigsMerge.current[ANIMATABLE_PROPERTIES.TEXT_COLOR]?.output ? mainNumberColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current[ANIMATABLE_PROPERTIES.TEXT_COLOR]?.output
    }) : undefined
    const bgColor = animationConfigsMerge.current[ANIMATABLE_PROPERTIES.BG_COLOR]?.output ? bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current[ANIMATABLE_PROPERTIES.BG_COLOR]?.output
    }) : undefined
    const borderColor = animationConfigsMerge.current[ANIMATABLE_PROPERTIES.BORDER_COLOR]?.output ? borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: animationConfigsMerge.current[ANIMATABLE_PROPERTIES.BORDER_COLOR]?.output
    }) : undefined

    return {
        fontSizeAnim: mainNumberFontAnim,
        borderWidthAnim: borderWidthAnim,
        bgColorInterpolation: bgColor,
        textColorInterpolation: mainNumberColorInterpolation,
        borderColorInterpolation: borderColor,
        opacityAnim: opacityAnim,
        animationConfigsMerge: animationConfigsMerge.current,
    }
}

export { useAnimateView }

/*
TODO: i was storing animated values in a useRef but when the animated function is changed
    let'ssay from Animation.timing() to Animation.loop() then the value was not updated correctly
    when animation.start() is called. research it in detail.
*/
