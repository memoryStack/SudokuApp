import React, { useEffect } from 'react'

import { View, StyleSheet } from 'react-native'

import { Provider } from 'react-redux'

import CodePush from 'react-native-code-push'

import { consoleLog } from '@utils/util'
import ModalProvider from './src/containers/ModalProvider'
import ThemeProvider from './src/containers/ThemeProvider'

import { SnackBar } from './src/apps/components/SnackBar/SnackBar'

import { NavigationProvider } from './src/navigation/navigator'

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
            consoleLog('@@@@@@@ JS update installed status', status)
        })
    }, [])

    return (
        <Provider store={store}>
            <ThemeProvider>
                <ModalProvider>
                    <View style={styles.container}>
                        <NavigationProvider />
                        <SnackBar />
                    </View>
                </ModalProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default CodePush(CODE_PUSH_OPTIONS)(App)
