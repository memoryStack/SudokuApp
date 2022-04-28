import React, { useState, useEffect, useImperativeHandle, useCallback } from 'react'
import { View, Text, Animated, StyleSheet, PanResponder, useWindowDimensions, BackHandler } from 'react-native'
import { Touchable } from '../components/Touchable'
import { rgba, noOperationFunction } from '../../utils/util'
import { fonts } from '../../resources/fonts/font'
import { EVENTS } from '../../constants/events'

const ANIMATION_DURATION = 150
let HEADER_HEIGHT = 50
const RELEASE_LIMIT_FOR_AUTO_SCROLL = 20
const DEFAULT_BOOTTOM_MOST_POSITION_RATIO = 0.9
const XXSMALL_SIZE = 8
const XSMALL_SPACE = 4
export const HC_OVERLAY_BG_COLOR = 'rgba(0, 0, 0, .8)'
const styles = StyleSheet.create({
    slidingParentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: HC_OVERLAY_BG_COLOR,
    },
    header: {
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'rgb(216, 217, 220)',
        borderTopLeftRadius: XXSMALL_SIZE,
        borderTopRightRadius: XXSMALL_SIZE,
    },
    subView: {
        position: 'absolute',
        width: '100%',
    },
    clipStyle: {
        height: XSMALL_SPACE,
        width: 24,
        borderRadius: XSMALL_SPACE,
        backgroundColor: rgba('#282C3F', 20),
    },
    headerText: {
        fontSize: 20,
        color: rgba('#282C3F', 90),
        fontFamily: fonts.regular,
    },
})

const BottomDragger_ = React.forwardRef((props, ref) => {
    const {
        parentHeight,
        headerText = '',
        bottomMostPositionRatio = DEFAULT_BOOTTOM_MOST_POSITION_RATIO,
        children,
        onDraggerOpened = noOperationFunction,
        onDraggerClosed = noOperationFunction,
        stopBackgroundClickClose = false,
        showBackgroundOverlay = true,
        animateBackgroundOverlayOnClose = true,
    } = props

    // consider children as full screen height later on set it to it's real height
    // when we receive event callback for height
    const { height: windowHeight } = useWindowDimensions()
    const [childrenHeight, setChildrenHeight] = useState(windowHeight)

    if (!headerText) HEADER_HEIGHT = 0 // header won't be present in this case

    // TODO: figure out how to remove this code duplication and how can we make it more efficient
    const [isFullView, setFullView] = useState(false)
    const [isDraggerActive, setIsDraggerActive] = useState(false)
    const [bottomMostPosition, setBottomMostPosition] = useState(parentHeight * bottomMostPositionRatio)
    const [topMostPosition, setTopMostPosition] = useState(parentHeight - (childrenHeight + HEADER_HEIGHT))
    const [transformValue, setTransformValue] = useState(new Animated.Value(bottomMostPosition))
    const [transparentViewOpacityConfig, setTransparentViewOpacityConfig] = useState(
        transformValue.interpolate({
            inputRange: [topMostPosition, bottomMostPosition],
            outputRange: [1, animateBackgroundOverlayOnClose ? 0 : 1],
        }),
    )

    const [panResponder, setPanResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => {
                setIsDraggerActive(true)
                return true
            },
            onPanResponderMove: (evt, gestureState) => {
                const nextPosition = (isFullView ? topMostPosition : bottomMostPosition) + gestureState.dy
                if (nextPosition > bottomMostPosition || nextPosition < topMostPosition) return
                transformValue.setValue(nextPosition)
            },
            onPanResponderRelease: (evt, gestureState) => {
                let nextPosition = isFullView ? topMostPosition : bottomMostPosition
                if (isFullView && gestureState.dy > RELEASE_LIMIT_FOR_AUTO_SCROLL) nextPosition = bottomMostPosition
                else if (!isFullView && gestureState.dy < -RELEASE_LIMIT_FOR_AUTO_SCROLL) nextPosition = topMostPosition
                moveDragger(nextPosition)
            },
        }),
    )

    useEffect(() => {
        const bottomMostPosition = parentHeight * bottomMostPositionRatio
        const topMostPosition = parentHeight - (childrenHeight + HEADER_HEIGHT)
        const transformValue = new Animated.Value(isFullView ? topMostPosition : bottomMostPosition)
        setBottomMostPosition(bottomMostPosition)
        setTopMostPosition(topMostPosition)
        setTransformValue(transformValue)

        setTransparentViewOpacityConfig(
            transformValue.interpolate({
                // this object is duplicated above as well
                inputRange: [topMostPosition, bottomMostPosition],
                outputRange: [1, animateBackgroundOverlayOnClose ? 0 : 1],
            }),
        )
    }, [parentHeight, childrenHeight, isFullView])

    useEffect(() => {
        setPanResponder(
            PanResponder.create({
                onStartShouldSetPanResponder: () => {
                    setIsDraggerActive(true)
                    return true
                },
                onPanResponderMove: (evt, gestureState) => {
                    const nextPosition = (isFullView ? topMostPosition : bottomMostPosition) + gestureState.dy
                    if (nextPosition > bottomMostPosition || nextPosition < topMostPosition) return
                    transformValue.setValue(nextPosition)
                },
                onPanResponderRelease: (evt, gestureState) => {
                    let nextPosition = isFullView ? topMostPosition : bottomMostPosition
                    if (isFullView && gestureState.dy > RELEASE_LIMIT_FOR_AUTO_SCROLL) nextPosition = bottomMostPosition
                    else if (!isFullView && gestureState.dy < -RELEASE_LIMIT_FOR_AUTO_SCROLL)
                        nextPosition = topMostPosition
                    moveDragger(nextPosition)
                },
            }),
        )
    }, [topMostPosition, bottomMostPosition, transformValue, isFullView, onDraggerOpened, onDraggerClosed])

    // TODO: add constants for these events to put them in one place
    useEffect(() => {
        const handler = () => {
            moveDragger()
            return true
        }
        const backHandler = BackHandler.addEventListener(EVENTS.HARDWARE_BACK_PRESS, handler)
        return () => {
            backHandler.remove()
        }
    }, [
        isFullView,
        isDraggerActive,
        bottomMostPosition,
        topMostPosition,
        onDraggerOpened,
        onDraggerClosed,
        transformValue,
    ])

    // TODO: i had to add "onDraggerOpened" and "onDraggerClosed" in the dependency array here
    // after that in "NextGameMenu" onDraggerOpened callback is reading correct game state. (revise this concept again)
    useImperativeHandle(
        ref,
        () => ({
            openDragger: (data = undefined) => moveDragger(topMostPosition, data),
            closeDragger: (data = undefined) => moveDragger(bottomMostPosition, data),
        }),
        [
            isFullView,
            isDraggerActive,
            bottomMostPosition,
            topMostPosition,
            onDraggerOpened,
            onDraggerClosed,
            transformValue,
        ],
    )

    const moveDragger = (toValue = bottomMostPosition, data = undefined) => {
        // parent component might open the dragger. so mark dragger as active
        if (!isDraggerActive) setIsDraggerActive(true)
        Animated.timing(transformValue, {
            toValue,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start(() => {
            const sholdBeFullView = toValue === topMostPosition ? true : false
            if (sholdBeFullView !== isFullView) {
                // there is a change in dragger's state so call callback and set new state
                setFullView(sholdBeFullView)
                if (!sholdBeFullView) setIsDraggerActive(false)
                sholdBeFullView ? onDraggerOpened(data) : onDraggerClosed(data)
            }
        })
    }

    const childrenOnLayout = useCallback(event => {
        const { nativeEvent: { layout: { height = 0 } = {} } = {} } = event
        setChildrenHeight(height)
        const topMostPosition = parentHeight - (height + HEADER_HEIGHT)
        setTopMostPosition(topMostPosition)
        // TODO: on children height changed dynamically, this openDragger will be called 2 times
        // STOP THAT
        if (!headerText) {
            // mostly we want the dragger to be opened itself when header
            // clip is not present
            setTimeout(() => {
                ref.current && ref.current.openDragger()
            }, 0)
        }
    }, [])

    // i can use a memo hook here
    // or i can leave it as well because it's very unlikely that user will actually play with this dragger
    // and not the game. lol
    const renderHeader = () => {
        return (
            <View style={styles.header} {...panResponder.panHandlers}>
                <View style={styles.clipStyle} />
                <Text style={styles.headerText}>{headerText}</Text>
            </View>
        )
    }

    if (!children) return null
    return (
        <>
            {isDraggerActive ? ( // either fully opened or moving
                <Touchable
                    touchable={'withoutFeedBack'}
                    onPress={() => !stopBackgroundClickClose && moveDragger(bottomMostPosition)}
                >
                    <Animated.View style={[styles.slidingParentContainer, { opacity: transparentViewOpacityConfig }]} />
                </Touchable>
            ) : null}
            <Animated.View
                style={[
                    styles.subView,
                    {
                        transform: [{ translateY: transformValue }],
                        height: childrenHeight + HEADER_HEIGHT,
                    },
                ]}
            >
                <View onLayout={childrenOnLayout}>
                    {headerText ? renderHeader() : null}
                    {children}
                </View>
            </Animated.View>
        </>
    )
})

export const BottomDragger = React.memo(BottomDragger_)
