import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'

import PropTypes from 'prop-types'

// import { TouchableOpacity } from 'react-native-gesture-handler'

import { Platform } from '../../utils/classes/platform'
// import { TouchableNativeFeedback as NewTouchableNativeFeedback } from 'react-native-gesture-handler'
// will fix error related to this later

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

// all touchables
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

// TODO: make it opacity only, most of the places i am using opacity
const defaultTouchable = Platform.isIOS() ? 'highLight' : 'nativeFeedBack'

const getTouchable = touchable => {
    if (!touchable) touchable = defaultTouchable
    touchable = touchable.toLowerCase().includes('nativefeedback') && Platform.isIOS() ? 'highLight' : touchable
    return TouchablesMap[touchable]
}

export const Touchable = props => {
    const {
        style, touchable, underlayColor = 'white', children, avoidDefaultStyles, addHitSlop, ...rest
    } = props

    const hitSlop = addHitSlop ? {
        top: 16, bottom: 16, left: 16, right: 16,
    } : null

    const Touchable = getTouchable(touchable)

    return (
        <Touchable
            style={[avoidDefaultStyles ? null : styles.container, style]}
            underlayColor={underlayColor}
            hitSlop={hitSlop}
            {...rest}
        >
            {children}
        </Touchable>
    )
}

Touchable.propTypes = {
    touchable: PropTypes.string,
    underlayColorType: PropTypes.object,
    avoidDefaultStyles: PropTypes.bool,
    addHitSlop: PropTypes.bool,
}

Touchable.defaultProps = {
    touchable: defaultTouchable,
    underlayColorType: {
        color: 'white',
        opacity: 0,
    },
    avoidDefaultStyles: false,
    addHitSlop: false,
}
