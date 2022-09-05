import React, { useCallback, useMemo } from 'react'

import { View, Text, Image } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { CloseIcon } from '../../../resources/svgIcons/close'
import { useBoardElementsDimensions } from '../../../utils/customHooks/boardElementsDimensions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { useIsHintTryOutStep } from '../utils/smartHints/hooks'
import { forCellEachNote as forEachInputNumber } from '../utils/util'

import { getStyles } from './style'
import { ACTION_TYPES } from './constants'

const Inputpanel_ = ({ numbersVisible, onAction, singleRow }) => {
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
                <Image style={styles.eraser} source={require('../../../resources/assets/eraser.png')} />
                {/* <CloseIcon height={CLOSE_ICON_DIMENSION} width={CLOSE_ICON_DIMENSION} fill={'rgb(40, 90, 163)'} /> */}
            </Touchable>
        )
    }

    const renderInputNumber = number => {
        return (
            <Touchable
                style={styles.numberButtonContainer}
                onPress={numbersVisible[number] ? () => onNumberClicked(number) : _noop}
                touchable={TouchableTypes.opacity}
                key={`${number}`}
            >
                <Text adjustsFontSizeToFit style={styles.textStyle}>
                    {numbersVisible[number] ? number : ''}
                </Text>
            </Touchable>
        )
    }

    const getPanelView = () => {
        const rows = []

        let row = []
        forEachInputNumber(number => {
            if (!isHintTryOut || (isHintTryOut && numbersVisible[number])) {
                row.push(renderInputNumber(number))
            }
            if (row.length >= 5 && !singleRow) {
                rows.push(
                    <View key={'rowOne'} style={styles.rowContainer}>
                        {row}
                    </View>,
                )
                row = []
            }
        })

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

Inputpanel_.propTypes = {
    numbersVisible: PropTypes.array,
    onAction: PropTypes.func,
    singleRow: PropTypes.bool,
}

Inputpanel_.defaultProps = {
    numbersVisible: new Array(10).fill(true),
    onAction: _noop,
    singleRow: false,
}