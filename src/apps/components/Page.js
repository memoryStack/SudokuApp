import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView, StyleSheet, AppState, Platform } from 'react-native'
import { EVENTS } from '../../constants/events'
import { noOperationFunction } from '../../utils/util'

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: '100%',
    },
})

const OUT_OF_FOCUS_APP_STATES = ['inactive', 'background']

const Page_ = ({
    children,
    onLayout = noOperationFunction,
    onFocus = noOperationFunction,
    onBlur = noOperationFunction,
    navigation,
}) => {
    const [isPageInFocus, setIsPageInFocus] = useState(AppState.currentState === 'active')

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

    // all the events for knowing that page is actually in focus or not
    useEffect(() => {
        AppState.addEventListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
        const unsubNavigation = [
            navigation && navigation.addListener(EVENTS.NAVIGATION.FOCUS, handleFocus),
            navigation && navigation.addListener(EVENTS.NAVIGATION.BLUR, handleBlur),
        ]
        if (Platform.OS === 'android') {
            AppState.addEventListener(EVENTS.APP_STATE.FOCUS, handleFocus)
            AppState.addEventListener(EVENTS.APP_STATE.BLUR, handleBlur)
        }
        return () => {
            AppState.removeEventListener(EVENTS.APP_STATE.CHANGE, handleAppStateChange)
            unsubNavigation.forEach(unsub => unsub && unsub())
            if (Platform.OS === 'android') {
                AppState.removeEventListener(EVENTS.APP_STATE.FOCUS, handleFocus)
                AppState.removeEventListener(EVENTS.APP_STATE.BLUR, handleBlur)
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
