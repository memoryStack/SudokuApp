import React from 'react'
import { View } from 'react-native'
import { Arena } from './src/apps/arena'
import { setListener } from './src/utils/GlobalEventBus'

// initialize the event bus

/**
 * right now it will contain the arena screen. later on will add proper screenNavigations logic n all
 */

const App = () => {

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

export default App
