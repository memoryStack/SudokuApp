import { Animated } from "react-native"
import { useEffect, useRef } from "react"

import { usePrevious } from "@utils/customHooks"

import { ANIMATABLE_PROPERTIES, createAnimationInstance } from "./animationUtils"

const useAnimateView = (cellAnimationsConfig) => {

    const DEFAULT_ANIMATION_VALUES = useRef({
        [ANIMATABLE_PROPERTIES.FONT_SIZE]: 1,
        [ANIMATABLE_PROPERTIES.TEXT_COLOR]: 0,
        [ANIMATABLE_PROPERTIES.BG_COLOR]: 0,
        [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: 0,
        [ANIMATABLE_PROPERTIES.BORDER_COLOR]: 0,
    }).current

    const mainNumberFontAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.FONT_SIZE])).current
    const mainNumberColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.TEXT_COLOR])).current // it's text color
    const bgColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BG_COLOR])).current
    const borderWidthAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_WIDTH])).current
    const borderColorAnim = useRef(new Animated.Value(DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_COLOR])).current

    const ANIMATED_PROPERTY_VS_ANIM_VALUE = {
        [ANIMATABLE_PROPERTIES.FONT_SIZE]: mainNumberFontAnim,
        [ANIMATABLE_PROPERTIES.TEXT_COLOR]: mainNumberColorAnim,
        [ANIMATABLE_PROPERTIES.BG_COLOR]: bgColorAnim,
        [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: borderWidthAnim,
        [ANIMATABLE_PROPERTIES.BORDER_COLOR]: borderColorAnim,
    }

    const originalAnimatedValuesBeforeAnimationStarted = useRef({
        [ANIMATABLE_PROPERTIES.FONT_SIZE]: {
            from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.FONT_SIZE],
            to: -1
        },
        [ANIMATABLE_PROPERTIES.TEXT_COLOR]: {
            from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.TEXT_COLOR],
            to: -1
        },
        [ANIMATABLE_PROPERTIES.BG_COLOR]: {
            from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BG_COLOR],
            to: -1
        },
        [ANIMATABLE_PROPERTIES.BORDER_WIDTH]: {
            from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_WIDTH],
            to: -1
        },
        [ANIMATABLE_PROPERTIES.BORDER_COLOR]: {
            from: DEFAULT_ANIMATION_VALUES[ANIMATABLE_PROPERTIES.BORDER_COLOR],
            to: -1
        },
    }).current

    const animationObj = useRef({})

    const previousAnimationsConfig = usePrevious(cellAnimationsConfig)

    const animationConfigsMerge = useRef({})

    animationConfigsMerge.current = {
        ...animationConfigsMerge.current,
        ...previousAnimationsConfig,
        ...cellAnimationsConfig
    }

    useEffect(() => {
        const allAnimations = animationConfigsMerge.current
        const listenersIDs = []
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
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].from,
                    animatableProperty,
                    allAnimations[animatableProperty]
                )

                animation.start()

                animationObj.current[animatableProperty] = animation
                // WARN: don't move the below .from update logic above createAnimationInstance function
                if (originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to !== -1) {
                    originalAnimatedValuesBeforeAnimationStarted[animatableProperty].from
                        = originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to
                }
                ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty].addListener(({ value }) => {
                    if (!Number.isNaN(value)) {
                        originalAnimatedValuesBeforeAnimationStarted[animatableProperty].to = value
                    }
                })

                listenersIDs.push(ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty])
            }
        })

        return () => {
            Object.keys(allAnimations).forEach((animatableProperty) => {
                const animatedValue = ANIMATED_PROPERTY_VS_ANIM_VALUE[animatableProperty]
                animatedValue.stopAnimation()
                animatedValue.removeAllListeners()
            })
        }
    }, [cellAnimationsConfig, previousAnimationsConfig])

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
        borderWidthAnim,
        bgColorInterpolation: bgColor,
        textColorInterpolation: mainNumberColorInterpolation,
        borderColorInterpolation: borderColor,
        animationConfigsMerge: animationConfigsMerge.current,
    }
}

export { useAnimateView }
