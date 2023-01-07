import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'

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

const defaultTouchable = Platform.isIOS() ? 'highLight' : 'nativeFeedBack'

const defaultProps = {
    touchable: defaultTouchable,
    underlayColorType: {
        color: 'white',
        opacity: 0,
    },
}

const getTouchable = touchable => {
    if (!touchable) touchable = defaultTouchable
    touchable = touchable.toLowerCase().includes('nativefeedback') && Platform.isIOS() ? 'highLight' : touchable
    return TouchablesMap[touchable]
}

export const Touchable = props => {
    const { style, touchable, underlayColor = 'white', children, ...rest } = props
    const Touchable = getTouchable(touchable)
    return (
        <Touchable style={[styles.container, style]} underlayColor={underlayColor} {...rest}>
            {children}
        </Touchable>
    )
}

// TODO: add proptypes as well for the ease of development
Touchable.defaultProps = defaultProps
