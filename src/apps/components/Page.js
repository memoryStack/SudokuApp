import React, { useState, useCallback, useEffect } from 'react'

import { SafeAreaView, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { Platform } from '../../utils/classes/platform'
import { AppState } from '../../utils/classes/appState'
import { EVENTS } from '../../constants/events'

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: '100%',
    },
})

const OUT_OF_FOCUS_APP_STATES = ['inactive', 'background']

const Page_ = ({
    children, onLayout, onFocus, onBlur, navigation,
}) => {
    const [isPageInFocus, setIsPageInFocus] = useState(AppState.currentState() === 'active')

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
        AppState.addListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
        if (Platform.isAndroid()) {
            AppState.addListener(EVENTS.APP_STATE.FOCUS, handleFocus)
            AppState.addListener(EVENTS.APP_STATE.BLUR, handleBlur)
        }

        return () => {
            AppState.removeListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
            if (Platform.isAndroid()) {
                AppState.removeListener(EVENTS.APP_STATE.FOCUS, handleFocus)
                AppState.removeListener(EVENTS.APP_STATE.BLUR, handleBlur)
            }
        }
    }, [handleAppStateChange, handleFocus, handleBlur, navigation])

    return (
        <SafeAreaView onLayout={onLayout} style={styles.safeAreaView}>
            {children}
        </SafeAreaView>
    )
}

export const Page = React.memo(Page_)

Page_.propTypes = {
    children: PropTypes.element,
    onLayout: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    navigation: PropTypes.object,
}

Page_.defaultProps = {
    children: null,
    onLayout: _noop,
    onFocus: _noop,
    onBlur: _noop,
    navigation: {},
}
