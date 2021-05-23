import React from 'react'
import { View } from 'react-native'
import { InputNumber } from './inputNumber'
import { Styles } from './style'

const looper = []
for(let i=1;i<=9;i++) looper.push(i)

export const Inputpanel = () => {
    return (
        <View style={Styles.container}>
            {
                looper.map(number => {
                    return (
                        <InputNumber number={number} />
                    )
                })
            }
        </View>
    )
}
