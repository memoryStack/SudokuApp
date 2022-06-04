import React, { useCallback, useMemo } from 'react'
import { View, Text } from 'react-native'
import { getStyles } from './style'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { useBoardElementsDimensions } from '../../../utils/customHooks/boardElementsDimensions'
import { noop } from '../../../utils/util'
import { ACTION_TYPES } from './constants'
import { useIsHintTryOutStep } from '../utils/smartHints/hooks'

const Inputpanel_ = ({ numbersVisible = new Array(10).fill(true), onAction }) => {

    const isHintTryOut = useIsHintTryOutStep()

    const { CELL_WIDTH } = useBoardElementsDimensions()

    const CLOSE_ICON_DIMENSION = CELL_WIDTH * (3 / 4)

    const styles = useMemo(() => {
        return getStyles(CELL_WIDTH)
    }, [CELL_WIDTH])

    const onNumberClicked = number => onAction({ type: ACTION_TYPES.ON_NUMBER_CLICK, payload: number })

    const onEraserClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_ERASE_CLICK })
    }, [onAction])

    const renderEraser = () => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={onEraserClick}
                touchable={TouchableTypes.opacity}
                key={'erase_cell'}
            >
                <CloseIcon height={CLOSE_ICON_DIMENSION} width={CLOSE_ICON_DIMENSION} fill={'rgb(40, 90, 163)'} />
            </Touchable>
        )
    }

    const renderInputNumber = number => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={numbersVisible[number] ? () => onNumberClicked(number) : noop}
                touchable={TouchableTypes.opacity}
                key={`${number}`}
            >
                <Text style={styles.textStyle}>{numbersVisible[number] ? number : ''}</Text>
            </Touchable>
        )
    }

    const getPanelView = () => {
        const rows = []

        let row = []
        for (let i = 1; i <= 9; i++) {// TODO: note or number looper. refactore it
            if (!isHintTryOut || isHintTryOut && numbersVisible[i]) {
                row.push(renderInputNumber(i))
            }
            if (row.length >= 5) {
                rows.push(
                    <View key={'rowOne'} style={styles.rowContainer}>
                        {row}
                    </View>,
                )
                row = []
            }
        }
        row.push(renderEraser())
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
