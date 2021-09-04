import React from 'react'
import { View, Text } from 'react-native'
import { styles } from './style'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { GAME_STATE, EVENTS } from '../../../resources/constants'
import { emit } from '../../../utils/GlobalEventBus'

const looper = []
for(let i=0;i<3;i++) looper.push(i)

const Inputpanel_ = ({eventsPrefix = '', gameState }) => {

    const onNumberClicked = (number) => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(eventsPrefix + EVENTS.INPUT_NUMBER_CLICKED, { number })
    }

    const inputNumber = number => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={() => onNumberClicked(number)}
                touchable={TouchableTypes.opacity}                
            >
                <Text style={styles.textStyle}>{number}</Text>
            </Touchable>
        )
    }

    const getGrid = orientation => {
        const isVertical = orientation === 'vertical'
        const orientationBasedStyles = { flexDirection: isVertical ? 'row' : 'column' }
        return (
            <View style={[styles.gridBorderContainer, orientationBasedStyles]}>
                {
                    [0, 1, 2, 3].map(() => {
                        return (
                            <View style={isVertical ? styles.verticalBars : styles.horizontalBars} />
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                looper.map(row => {
                    return (
                        <View style={styles.rowContainer}>
                            {
                                looper.map(col => {
                                    const number = row * 3 + (col + 1)
                                    return inputNumber(number)
                                })
                            }
                        </View>
                    )
                })
            }
            {/* {getGrid('horizontal')}
            {getGrid('vertical')} */}
        </View>
    )
}

export const Inputpanel = React.memo(Inputpanel_)
