import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ViewPropTypes,
    Animated,
} from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { Platform } from '../../utils/classes/platform'
// import { TouchableNativeFeedback as NewTouchableNativeFeedback } from 'react-native-gesture-handler'
// will fix error related to this later

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export const TouchableTypes = {
    nativeFeedBack: 'nativeFeedBack',
    highLight: 'highLight',
    opacity: 'opacity',
    withoutFeedBack: 'withoutFeedBack',
    newNativeFeedBack: 'newNativeFeedBack',
}

const TouchablesMap = {
    nativeFeedBack: TouchableNativeFeedback,
    highLight: TouchableHighlight,
    opacity: TouchableOpacity,
    withoutFeedBack: TouchableWithoutFeedback,
    // newNativeFeedBack: NewTouchableNativeFeedback,
}

const defaultTouchable = TouchableTypes.opacity

const getFinalTouchableType = touchableFromProps => {
    if (!touchableFromProps) return defaultTouchable
    return touchableFromProps.toLowerCase().includes('nativefeedback') && Platform.isIOS() ? 'highLight' : touchableFromProps
}

const getTouchable = touchable => TouchablesMap[getFinalTouchableType(touchable)]

export const Touchable = props => {
    const {
        style,
        touchable,
        underlayColor,
        children,
        avoidDefaultStyles,
        addHitSlop,
        isAnimated,
        animatableStyles,
        ...rest
    } = props

    const hitSlop = addHitSlop ? {
        top: 16, bottom: 16, left: 16, right: 16,
    } : null

    const TouchableComponent = getTouchable(touchable)

    // due to this wrapper onPress propogation is not working
    // TODO: figure it out
    const Wrapper = ({ children }: any) => {
        console.log('@@@@ is animated', isAnimated)
        if (isAnimated) {
            return <Animated.View>{children}</Animated.View>
        }
        return <>{children}</>
    }

    return (
        <TouchableComponent
            style={[avoidDefaultStyles ? null : styles.container, style]}
            underlayColor={underlayColor}
            hitSlop={hitSlop}
            {...rest}
        >
            {
                isAnimated ? (
                    <Animated.View style={animatableStyles}>
                        {children}
                    </Animated.View>
                ) : children
            }
        </TouchableComponent>
    )
}

Touchable.propTypes = {
    children: PropTypes.node,
    touchable: PropTypes.string,
    underlayColorType: PropTypes.object,
    avoidDefaultStyles: PropTypes.bool,
    addHitSlop: PropTypes.bool,
    style: ViewPropTypes.style,
    underlayColor: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    accessibilityRole: PropTypes.string,
    testID: PropTypes.string,
}

Touchable.defaultProps = {
    children: null,
    touchable: defaultTouchable,
    underlayColorType: {
        color: 'white',
        opacity: 0,
    },
    avoidDefaultStyles: false,
    addHitSlop: false,
    style: null,
    underlayColor: 'white',
    onPress: _noop,
    disabled: false,
    accessibilityRole: null,
    testID: '',
}
