import React, { useCallback, useMemo } from 'react'
import { View, Text } from 'react-native'
import { getStyles } from './style'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { GAME_STATE, EVENTS } from '../../../resources/constants'
import { emit } from '../../../utils/GlobalEventBus'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { useBoardElementsDimensions } from '../../../utils/customHooks/boardElementsDimensions'
import { noOperationFunction } from '../../../utils/util'

const CLOSE_ICON_DIMENSION = 28
const Inputpanel_ = ({ eventsPrefix = '', gameState, mainNumbersInstancesCount }) => {
    const { CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => {
        return getStyles(CELL_WIDTH)
    }, [CELL_WIDTH])

    const onNumberClicked = number => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(eventsPrefix + EVENTS.INPUT_NUMBER_CLICKED, { number })
    }

    const areAllInstancesFilled = (number) => mainNumbersInstancesCount[number] === 9

    const renderInputNumber = number => {
        const allInstancesFilled = areAllInstancesFilled(number)
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={!allInstancesFilled ? () => onNumberClicked(number) : noOperationFunction}
                touchable={TouchableTypes.opacity}
                key={`${number}`}
            >
                <Text style={styles.textStyle}>{allInstancesFilled ? '' : number}</Text>
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
                key={'erase_cell'}
            >
                <CloseIcon height={CLOSE_ICON_DIMENSION} width={CLOSE_ICON_DIMENSION} fill={'rgb(40, 90, 163)'} />
            </Touchable>
        )
    }    

    const getPanelView = () => {
        const rows = []

        let row = []
        for (let i = 1; i <= 9; i++) {
            row.push(renderInputNumber(i))
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
