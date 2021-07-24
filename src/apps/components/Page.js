import React, { useState, useCallback, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet, AppState, Platform } from 'react-native'
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

    const handleAppStateChange = useCallback(nextAppState => {
        const hasComeToBlur = OUT_OF_FOCUS_APP_STATES.indexOf(nextAppState) !== -1
        const hasComeToFocus = nextAppState === 'active'
        if (!isPageInFocus && hasComeToFocus) handleFocus()
        if (isPageInFocus && hasComeToBlur) handleBlur()
    }, [isPageInFocus, handleFocus, handleBlur])

    // all the events for koowing that page is actually in focus or not
    useEffect(() => {
        // TODO: add react-navigation 'focus' and 'blur' events
        AppState.addEventListener('change', handleAppStateChange)
        if (Platform.OS === 'android') {
            AppState.addEventListener('focus', handleFocus)
            AppState.addEventListener('blur', handleBlur)
        }
        return () => {
            AppState.removeEventListener('change', handleAppStateChange)
            if (Platform.OS === 'android') {
                AppState.removeEventListener('focus', handleFocus)
                AppState.removeEventListener('blur', handleBlur)
            }
        }
    }, [handleAppStateChange, handleFocus, handleBlur])

    return (
        <SafeAreaView
            onLayout={onLayout}
            style={styles.safeAreaView}
        >
            {children}
        </SafeAreaView>
    )
}

export const Page = React.memo(Page_)
