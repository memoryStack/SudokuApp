import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, PanResponder } from 'react-native'
import { Touchable } from '../components/Touchable'
import { rgba, noOperationFunction } from '../../utils/util'

const ANIMATION_DURATION = 150
const HEADER_HEIGHT = 50
const RELEASE_LIMIT_FOR_AUTO_SCROLL = 50
const DEFAULT_BOOTTOM_MOST_POSITION_RATIO = .8
const XXSMALL_SIZE = 8
const XSMALL_SPACE = 4
const styles = StyleSheet.create({
    slidingParentContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    header: {
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: rgba('#282C3F', 10),
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
    },
})

const BottomDragger_ = ({
    children,
    parentHeight,
    childrenHeight,
    headerText,
    bottomMostPositionRatio = DEFAULT_BOOTTOM_MOST_POSITION_RATIO,
    onDraggerOpened = noOperationFunction
}) => {
    // TODO: figure out how to remove this code duplication and how can we make it more efficient
    const [isFullView, setFullView] = useState(false)
    const [bottomMostPosition, setBottomMostPosition] = useState(parentHeight * bottomMostPositionRatio)
    const [topMostPosition, setTopMostPosition] = useState(parentHeight - (childrenHeight + HEADER_HEIGHT))
    const [transformValue, setTransformValue] = useState(new Animated.Value(bottomMostPosition))
    const [transparentViewOpacityConfig, setTransparentViewOpacityConfig] = useState(transformValue.interpolate({
        inputRange: [topMostPosition, bottomMostPosition],
        outputRange: [1, 0],
    }))
    const [panResponder, setPanResponder] = useState(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            const nextPosition = (isFullView ? topMostPosition : bottomMostPosition) + gestureState.dy
            if (nextPosition > bottomMostPosition || nextPosition < topMostPosition) return
            transformValue.setValue(nextPosition)
        },
        onPanResponderRelease: (evt, gestureState) => {
            let nextPosition = isFullView ? topMostPosition : bottomMostPosition
            if (isFullView && gestureState.dy > RELEASE_LIMIT_FOR_AUTO_SCROLL) {
                nextPosition = bottomMostPosition
            } else if (!isFullView && gestureState.dy < -RELEASE_LIMIT_FOR_AUTO_SCROLL) {
                nextPosition = topMostPosition
            }
            const shouldBeFullView = nextPosition === topMostPosition
            Animated.timing(transformValue, {
                toValue: nextPosition,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start(() => {
                setFullView(shouldBeFullView)
                if (!isFullView && shouldBeFullView) onDraggerOpened()
            })
        },
    }))

    useEffect(() => {
        const bottomMostPosition = parentHeight * bottomMostPositionRatio
        const topMostPosition = parentHeight - (childrenHeight + HEADER_HEIGHT)
        const transformValue = new Animated.Value(bottomMostPosition)
        setBottomMostPosition(bottomMostPosition)
        setTopMostPosition(topMostPosition)
        setTransformValue(transformValue)
        setTransparentViewOpacityConfig(
            transformValue.interpolate({
                inputRange: [topMostPosition, bottomMostPosition],
                outputRange: [1, 0],
            })
        )
    }, [parentHeight])

    useEffect(() => {
        setPanResponder(PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const nextPosition = (isFullView ? topMostPosition : bottomMostPosition) + gestureState.dy
                if (nextPosition > bottomMostPosition || nextPosition < topMostPosition) return
                transformValue.setValue(nextPosition)
            },
            onPanResponderRelease: (evt, gestureState) => {
                let nextPosition = isFullView ? topMostPosition : bottomMostPosition
                if (isFullView && gestureState.dy > RELEASE_LIMIT_FOR_AUTO_SCROLL) {
                    nextPosition = bottomMostPosition
                } else if (!isFullView && gestureState.dy < -RELEASE_LIMIT_FOR_AUTO_SCROLL) {
                    nextPosition = topMostPosition
                }
                const shouldBeFullView = nextPosition === topMostPosition
                Animated.timing(transformValue, {
                    toValue: nextPosition,
                    duration: ANIMATION_DURATION,
                    useNativeDriver: true,
                }).start(() => {
                    setFullView(shouldBeFullView)
                    if (!isFullView && shouldBeFullView) onDraggerOpened()
                })
            },
        }))
    }, [topMostPosition, bottomMostPosition, transformValue, isFullView])

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

    const lowerOverlay = () => {
        Animated.timing(transformValue, {
            toValue: bottomMostPosition,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start(() => {
            setFullView(false)
        })
    }

    if (!children) return null
    return (
        <>
            {isFullView ? (
                <Touchable touchable={'withoutFeedBack'} onPress={lowerOverlay}>
                    <Animated.View
                        style={[styles.slidingParentContainer, { opacity: transparentViewOpacityConfig }]}
                    />
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
                {renderHeader()}
                {children}
            </Animated.View>
        </>
    )
}

export const BottomDragger = React.memo(BottomDragger_)
