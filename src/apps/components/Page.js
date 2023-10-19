import React, { useState, useCallback, useEffect } from 'react'

import { SafeAreaView, StyleSheet, ViewPropTypes } from 'react-native'

import PropTypes from 'prop-types'

import { useNavigation } from '@react-navigation/native'

import _noop from '@lodash/noop'
import _get from '@lodash/get'

import { consoleLog } from '@utils/util'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStyles } from '@utils/customHooks/useStyles'
import { Platform } from '../../utils/classes/platform'
import { AppState } from '../../utils/classes/appState'
import { EVENTS } from '../../constants/events'

const getStyles = (_, theme) => StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: '100%',
        backgroundColor: _get(theme, ['colors', 'surface']),
    },
})

const OUT_OF_FOCUS_APP_STATES = ['inactive', 'background']

const Page_ = ({
    children,
    onLayout,
    onFocus,
    onBlur,
    style: styleProp,
    ...restProps
}) => {
    const navigation = useNavigation()

    const insets = useSafeAreaInsets()

    const [isPageInFocus, setIsPageInFocus] = useState(AppState.currentState() === 'active')

    const styles = useStyles(getStyles)

    const handleFocus = useCallback(() => {
        if (isPageInFocus) return
        setIsPageInFocus(true)
        onFocus()
    }, [isPageInFocus, onFocus])

    const handleBlur = useCallback(() => {
        if (!isPageInFocus) return
        setIsPageInFocus(false)
        onBlur()
    }, [isPageInFocus, onBlur])

    const handleAppStateChange = useCallback(
        nextAppState => {
            const hasComeToBlur = OUT_OF_FOCUS_APP_STATES.indexOf(nextAppState) !== -1
            const hasComeToFocus = nextAppState === 'active'
            if (!isPageInFocus && hasComeToFocus) handleFocus()
            if (isPageInFocus && hasComeToBlur) handleBlur()
        },
        [isPageInFocus, handleFocus, handleBlur],
    )

    useEffect(() => {
        const unsubNavigation = [
            navigation && navigation.addListener(EVENTS.NAVIGATION.FOCUS, handleFocus),
            navigation && navigation.addListener(EVENTS.NAVIGATION.BLUR, handleBlur),
        ]

        return () => unsubNavigation.forEach(unsub => unsub && unsub())
    }, [navigation, handleFocus, handleBlur])

    useEffect(() => {
        const appState = new AppState()
        try {
            appState.addListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
        } catch (err) {
            consoleLog(err)
        }
        if (Platform.isAndroid()) {
            try {
                appState.addListener(EVENTS.APP_STATE.FOCUS, handleFocus)
                appState.addListener(EVENTS.APP_STATE.BLUR, handleBlur)
            } catch (err) {
                consoleLog(err)
            }
        }

        return () => {
            appState.removeListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
            if (Platform.isAndroid()) {
                appState.removeListener(EVENTS.APP_STATE.FOCUS, handleFocus)
                appState.removeListener(EVENTS.APP_STATE.BLUR, handleBlur)
            }
        }
    }, [handleAppStateChange, handleFocus, handleBlur, navigation])

    return (
        <SafeAreaView
            onLayout={onLayout}
            style={[styles.safeAreaView, styleProp, { paddingTop: insets.top + (Platform.isIOS() ? 64 : 56) }]}
            {...restProps}
        >
            {children}
        </SafeAreaView>
    )
}

export const Page = React.memo(Page_)

Page_.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    onLayout: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: ViewPropTypes.style,
}

Page_.defaultProps = {
    children: null,
    onLayout: _noop,
    onFocus: _noop,
    onBlur: _noop,
    style: null,
}
