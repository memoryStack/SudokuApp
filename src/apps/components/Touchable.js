import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    TouchableNativeFeedback,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
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

const defaultTouchable = Platform.OS === 'ios' ? 'highLight' : 'nativeFeedBack'

const defaultProps = {
    touchable: defaultTouchable,
    underlayColorType: {
        color: 'white',
        opacity: 0,
    },
}

const getTouchable = touchable => {
    if (!touchable) touchable = defaultTouchable
    touchable = touchable.toLowerCase().includes('nativefeedback') && Platform.OS === 'ios' ? 'highLight' : touchable
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

Touchable.defaultProps = defaultProps
