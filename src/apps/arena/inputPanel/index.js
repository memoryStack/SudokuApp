import React, { useCallback } from 'react'
import { View, Text } from 'react-native'
import { styles } from './style'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { GAME_STATE, EVENTS } from '../../../resources/constants'
import { emit } from '../../../utils/GlobalEventBus'

const Inputpanel_ = ({ eventsPrefix = '', gameState }) => {
    const onNumberClicked = number => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(eventsPrefix + EVENTS.INPUT_NUMBER_CLICKED, { number })
    }

    const inputNumber = number => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={() => onNumberClicked(number)}
                touchable={TouchableTypes.opacity}
                key={`${number}`}
            >
                <Text style={styles.textStyle}>{number}</Text>
            </Touchable>
        )
    }

    const onEmptyCellClicked = useCallback(() => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(eventsPrefix + EVENTS.ERASER_CLICKED)
    }, [eventsPrefix, gameState])

    const getClearCellView = () => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={onEmptyCellClicked}
                touchable={TouchableTypes.opacity}
                key={'X'}
            >
                <Text style={styles.textStyle}>{'X'}</Text>
            </Touchable>
        )
    }

    const getPanelView = () => {
        const rows = []

        let row = []
        for (let i = 1; i <= 9; i++) {
            row.push(inputNumber(i))
            if (i === 5) {
                rows.push(
                    <View key={'rowOne'} style={styles.rowContainer}>
                        {row}
                    </View>,
                )
                row = []
            }
        }
        row.push(getClearCellView())
        rows.push(<View key={'hori_seperator'} style={styles.horizontalSeperator} />)
        rows.push(
            <View key={'rowTwo'} style={styles.rowContainer}>
                {row}
            </View>,
        )
        return rows
    }

    return <View style={styles.container}>{getPanelView()}</View>
}

export const Inputpanel = React.memo(Inputpanel_)
