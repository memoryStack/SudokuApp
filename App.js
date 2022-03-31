import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import CodePush from 'react-native-code-push'
import { Provider } from 'react-redux'

import { addListener, removeListener } from './src/utils/GlobalEventBus'
import { SnackBar } from './src/apps/components/SnackBar'
import { EVENTS } from './src/resources/constants'
import { NavigationContainer } from '@react-navigation/native'
import { getNavigator } from './src/navigation/navigator'

import store from './src/redux/store'

// initialize the event bus

/**
 * right now it will contain the arena screen. later on will add proper screenNavigations logic n all
 */

const CODE_PUSH_OPTIONS = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
}

const App = () => {
    // TODO: codepush is giving some error for ios
    // {"status":400,"name":"Error","message":"Missing required query parameter \"deployment_key\""}
    useEffect(() => {
        CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE }, status => {
            console.log('@@@@@@@ JS update installed status', status)
        })
    }, [])

    const [snackbarMsg, setSnackBarMsg] = useState('')
    const [snackbar, setSnackBarView] = useState(null)

    // added pretty raw implementation for snackbars right now
    // later on after finalizing a robust implementation i can make
    // an HOC so that tis snackbar can be re-used for each view
    useEffect(() => {
        const handler = ({ snackbarView = null, msg = '', visibleTime = 3000 }) => {
            if (!snackbarView && !msg) return
            if (msg) setSnackBarMsg(msg)
            else setSnackBarView(snackbarView)
            setTimeout(() => {
                if (msg) setSnackBarMsg('')
                else setSnackBarView(null)
            }, visibleTime)
        }
        addListener(EVENTS.SHOW_SNACK_BAR, handler)
        return () => {
            removeListener(EVENTS.SHOW_SNACK_BAR, handler)
        }
    }, [])

    // TODO: why putting here alignItems to center make everything invisible ??
    return (
        <Provider store={store}>
            <View
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'white',
                }}
            >
                <NavigationContainer>{getNavigator()}</NavigationContainer>
                {snackbar}
                {snackbarMsg ? <SnackBar msg={snackbarMsg} /> : null}
            </View>
        </Provider>
    )
}

export default CodePush(CODE_PUSH_OPTIONS)(App)
// export default App
