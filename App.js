import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { Arena } from './src/apps/arena'
import CodePush from 'react-native-code-push'

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
    CodePush.sync({installMode: CodePush.InstallMode.IMMEDIATE}, (status) => {
      console.log('@@@@@@@ JS update installed status', status)
    })
  }, [])
    
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Arena />      
    </View>
    
  );

};

export default CodePush(CODE_PUSH_OPTIONS)(App)
