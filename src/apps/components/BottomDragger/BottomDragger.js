import React, {
    useState, useEffect, useImperativeHandle, useCallback,
} from 'react'
import {
    View, Text, Animated, PanResponder, useWindowDimensions, BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'
import { EVENTS } from '../../../constants/events'

import { Touchable, TouchableTypes } from '../Touchable'

import {
    ANIMATION_DURATION,
    HEADER_HEIGHT,
    RELEASE_LIMIT_FOR_AUTO_SCROLL,
    DEFAULT_BOOTTOM_MOST_POSITION_RATIO,
    CONTENT_CONTAINER_TEST_ID,
    BOTTOM_DRAGGER_OVERLAY_TEST_ID,
} from './bottomDragger.constants'
import { getStyles } from './bottomDragger.styles'

const BottomDragger_ = React.forwardRef((props, ref) => {
    const {
        parentHeight,
        headerText,
        bottomMostPositionRatio,
        children,
        onDraggerOpened,
        onDraggerClosed,
        stopBackgroundClickClose,
        showBackgroundOverlay,
        animateBackgroundOverlayOnClose,
        testID,
    } = props

    const styles = useStyles(getStyles)

    // consider children as full screen height later on set it to it's real height
    // when we receive event callback for height
    const { height: windowHeight } = useWindowDimensions()
    const [childrenHeight, setChildrenHeight] = useState(windowHeight)

    const headerHeight = headerText ? HEADER_HEIGHT : 0

    // TODO: figure out how to remove this code duplication and how can we make it more efficient
    const [isFullView, setFullView] = useState(false)
    const [isDraggerActive, setIsDraggerActive] = useState(false)
    const [bottomMostPosition, setBottomMostPosition] = useState(parentHeight * bottomMostPositionRatio)
    const [topMostPosition, setTopMostPosition] = useState(parentHeight - (childrenHeight + headerHeight))
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
        const topMostPosition = parentHeight - (childrenHeight + headerHeight)
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
                    else if (!isFullView && gestureState.dy < -RELEASE_LIMIT_FOR_AUTO_SCROLL) {
                        nextPosition = topMostPosition
                    }
                    moveDragger(nextPosition)
                },
            }),
        )
    }, [topMostPosition, bottomMostPosition, transformValue, isFullView, onDraggerOpened, onDraggerClosed])

    useEffect(() => {
        const handler = () => {
            moveDragger()
            return true
        }
        const backHandler = BackHandler.addEventListener(EVENTS.HARDWARE_BACK_PRESS, handler)
        return () => backHandler.remove()
    }, [
        isFullView,
        isDraggerActive,
        bottomMostPosition,
        topMostPosition,
        onDraggerOpened,
        onDraggerClosed,
        transformValue,
    ])

    useImperativeHandle(
        ref,
        () => ({
            openDragger: data => moveDragger(topMostPosition, data),
            closeDragger: data => moveDragger(bottomMostPosition, data),
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

    const moveDragger = (toValue = bottomMostPosition, data) => {
        // parent component might open the dragger. so mark dragger as active
        if (!isDraggerActive) setIsDraggerActive(true)
        Animated.timing(transformValue, {
            toValue,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start(() => {
            const shouldBeFullView = toValue === topMostPosition
            if (shouldBeFullView !== isFullView) {
                // there is a change in dragger's state so call callback and set new state
                setFullView(shouldBeFullView)
                if (!shouldBeFullView) setIsDraggerActive(false)
                shouldBeFullView ? onDraggerOpened(data) : onDraggerClosed(data)
            }
        })
    }

    const childrenOnLayout = useCallback(event => {
        const { nativeEvent: { layout: { height = 0 } = {} } = {} } = event
        setChildrenHeight(height)
        const topMostPosition = parentHeight - (height + headerHeight)
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

    const renderHeader = () => (
        <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.clipStyle} />
            <Text style={styles.headerText}>{headerText}</Text>
        </View>
    )

    const renderBackgroundOverlay = () => {
        if (!isDraggerActive) return null
        return (
            <Touchable
                touchable={TouchableTypes.withoutFeedBack}
                onPress={() => !stopBackgroundClickClose && moveDragger(bottomMostPosition)}
                testID={BOTTOM_DRAGGER_OVERLAY_TEST_ID}
            >
                <Animated.View style={[styles.slidingParentContainer, { opacity: transparentViewOpacityConfig }]} />
            </Touchable>
        )
    }

    if (!children) return null
    return (
        <>
            {renderBackgroundOverlay()}
            <Animated.View
                style={[
                    styles.subView,
                    {
                        transform: [{ translateY: transformValue }],
                        height: childrenHeight + headerHeight,
                    },
                ]}
                testID={testID}
            >
                <View onLayout={childrenOnLayout} testID={CONTENT_CONTAINER_TEST_ID}>
                    {headerText ? renderHeader() : null}
                    {children}
                </View>
            </Animated.View>
        </>
    )
})

export const BottomDragger = React.memo(BottomDragger_)

BottomDragger_.propTypes = {
    parentHeight: PropTypes.number,
    headerText: PropTypes.string,
    bottomMostPositionRatio: PropTypes.number,
    children: PropTypes.element,
    onDraggerOpened: PropTypes.func,
    onDraggerClosed: PropTypes.func,
    stopBackgroundClickClose: PropTypes.bool,
    showBackgroundOverlay: PropTypes.bool,
    animateBackgroundOverlayOnClose: PropTypes.bool,
    testID: PropTypes.string,
}

BottomDragger_.defaultProps = {
    parentHeight: 0,
    headerText: '',
    bottomMostPositionRatio: DEFAULT_BOOTTOM_MOST_POSITION_RATIO,
    children: null,
    onDraggerOpened: _noop,
    onDraggerClosed: _noop,
    stopBackgroundClickClose: false,
    showBackgroundOverlay: true,
    animateBackgroundOverlayOnClose: true,
    testID: '',
}
