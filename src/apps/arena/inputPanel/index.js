import React from 'react'
import { View } from 'react-native'
import { InputNumber } from './inputNumber'
import { Styles } from './style'

const looper = []
for(let i=1;i<=9;i++) looper.push(i)

const Inputpanel_ = ({ gameState }) => {
    return (
        <View style={Styles.container}>
            {
                looper.map(number => {
                    return (
                        <View style={Styles.numberButtonContainer} key={number}>
                            <InputNumber number={number} gameState={gameState} />
                        </View>
                    )
                })
            }
        </View>
    )
}

export const Inputpanel = React.memo(Inputpanel_)