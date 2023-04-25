import React, { useCallback, useMemo } from 'react'

import { View, Text, Image } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { useIsHintTryOutStep } from '../utils/smartHints/hooks'
import { forCellEachNote as forEachInputNumber } from '../utils/util'
import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { getStyles } from './style'
import { ACTION_TYPES } from './constants'

const Inputpanel_ = ({ numbersVisible, onAction, singleRow }) => {
    const isHintTryOut = useIsHintTryOutStep()

    const { CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => getStyles(CELL_WIDTH), [CELL_WIDTH])

    const onNumberClicked = number => {
        onAction({ type: ACTION_TYPES.ON_NUMBER_CLICK, payload: number })
    }

    const onEraserClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_ERASE_CLICK })
    }, [onAction])

    const renderEraser = () => (
        <Touchable
            style={styles.numberButtonContainer}
            onPress={onEraserClick}
            touchable={TouchableTypes.opacity}
            key="erase_cell"
        >
            <Image style={styles.eraser} source={require('../../../resources/assets/eraser.png')} />
        </Touchable>
    )

    const renderInputNumber = number => (
        <Button
            key={`${number}`}
            type={BUTTON_TYPES.TONAL}
            state={numbersVisible[number] ? BUTTON_STATES.ENABLED : BUTTON_STATES.DISABLED}
            containerStyle={styles.numberButtonContainer}
            onPress={() => onNumberClicked(number)}
            label={number}
            textStyles={styles.textStyle}
        />
    )

    const isNumberEligibleToAddInPanel = number => !isHintTryOut || (isHintTryOut && numbersVisible[number])

    const addNumberInPanelRowIfEligible = (number, rowItems) => {
        if (isNumberEligibleToAddInPanel(number)) rowItems.push(renderInputNumber(number))
    }

    const renderHorizontalSeparator = () => <View key="hori_seperator" style={styles.horizontalSeperator} />

    const renderPanelRow = (rowItems, key) => (
        <View key={key} style={styles.rowContainer}>
            {rowItems}
        </View>
    )

    const renderPanelView = () => {
        const rows = []
        let rowItems = []
        forEachInputNumber(number => {
            addNumberInPanelRowIfEligible(number, rowItems)
            if (rowItems.length >= 5 && !singleRow) {
                rows.push(renderPanelRow(rowItems, 'rowOne'))
                rowItems = []
            }
        })

        rowItems.push(renderEraser())
        rows.push(renderHorizontalSeparator())
        rows.push(renderPanelRow(rowItems, 'rowTwo'))
        return rows
    }

    return <View style={styles.container}>{renderPanelView()}</View>
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
