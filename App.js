import React, {
    useRef, useCallback, useEffect, useState,
} from 'react'

import { View, StyleSheet } from 'react-native'

import { Provider } from 'react-redux'

import CodePush from 'react-native-code-push'

import { NavigationContainer } from '@react-navigation/native'

import _isEmpty from 'lodash/src/utils/isEmpty'

import ModalProvider from 'src/containers/ModalProvider'

import { addListener, removeListener } from './src/utils/GlobalEventBus'
import { SnackBar } from './src/apps/components/SnackBar'
import { EVENTS } from './src/constants/events'
import { getNavigator } from './src/navigation/navigator'

import store from './src/redux/store'

import './src/i18n/i18n.config'

const CODE_PUSH_OPTIONS = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const styles = StyleSheet.create({
    // TODO: why putting here alignItems to center make everything invisible ??
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
})

const App = () => {
    // TODO: codepush is giving some error for ios
    // {"status":400,"name":"Error","message":"Missing required query parameter \"deployment_key\""}
    useEffect(() => {
        CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE }, status => {
            console.log('@@@@@@@ JS update installed status', status)
        })
    }, [])

    const [snackBar, setSnackBar] = useState({
        show: false, view: null, msg: '', customStyles: null,
    })
    const snackBarTimerID = useRef(null)
    // added pretty raw implementation for snackbars right now
    // later on after finalizing a robust implementation i can make
    // an HOC so that tis snackbar can be re-used for each view

    const hideSnackBar = () => {
        setSnackBar({
            show: false, view: null, msg: '', customStyles: null,
        })
    }

    useEffect(() => {
        const handler = ({
            snackbarView = null, msg = '', visibleTime = 3000, customStyles = null,
        }) => {
            if (_isEmpty(snackbarView) && _isEmpty(msg)) return

            setSnackBar({
                show: true, view: snackbarView, msg, customStyles,
            })
            snackBarTimerID.current = setTimeout(hideSnackBar, visibleTime)
        }
        addListener(EVENTS.LOCAL.SHOW_SNACK_BAR, handler)
        return () => removeListener(EVENTS.LOCAL.SHOW_SNACK_BAR, handler)
    }, [])

    const onCloseSnackBar = useCallback(() => {
        snackBarTimerID.current && clearTimeout(snackBarTimerID.current)
        hideSnackBar()
    }, [])

    const renderSnackBar = () => {
        if (!snackBar.show) return null
        if (snackBar.view) return snackBar.view
        return <SnackBar msg={snackBar.msg} customStyles={snackBar.customStyles} onClose={onCloseSnackBar} />
    }

    return (
        <Provider store={store}>
            <ModalProvider>
                <View style={styles.container}>
                    <NavigationContainer>{getNavigator()}</NavigationContainer>
                    {renderSnackBar()}
                </View>
            </ModalProvider>
        </Provider>
    )
}

export default CodePush(CODE_PUSH_OPTIONS)(App)
