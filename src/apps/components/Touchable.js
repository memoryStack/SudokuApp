import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ViewPropTypes,
} from 'react-native'

import PropTypes from 'prop-types'

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
        ...rest
    } = props

    const hitSlop = addHitSlop ? {
        top: 16, bottom: 16, left: 16, right: 16,
    } : null

    const TouchableComponent = getTouchable(touchable)

    return (
        <TouchableComponent
            style={[avoidDefaultStyles ? null : styles.container, style]}
            underlayColor={underlayColor}
            hitSlop={hitSlop}
            {...rest}
        >
            {children}
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
}
