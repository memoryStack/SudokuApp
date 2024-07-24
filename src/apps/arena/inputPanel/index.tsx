import React, { useCallback, useMemo } from 'react'

import { View, Image, ImageStyle } from 'react-native'

import _noop from '@lodash/noop'

import { BoardIterators, CellEachNoteCallback } from '@domain/board/utils/boardIterators'

import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { OnAction } from '@utils/hocs/withActions/types'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { getStyles } from './inputPanel.styles'
import { ACTION_TYPES, INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID } from './constants'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ERASER_SOURCE = require('@resources/assets/eraser.png')

export type InputNumber = Parameters<CellEachNoteCallback>[0]

interface Props {
    numbersVisible?: InputPanelVisibleNumbers
    onAction?: OnAction
    singleRow?: boolean
    disableNumbersInput?: boolean
    disableEraser?: boolean
    shouldAddNumberInPanel: (number: number) => boolean
}

const Inputpanel_: React.FC<Props> = ({
    numbersVisible = new Array(10).fill(true),
    onAction = _noop,
    singleRow = false,
    disableNumbersInput = false,
    disableEraser = false,
    shouldAddNumberInPanel = _noop,
}) => {
    const { CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => getStyles(CELL_WIDTH), [CELL_WIDTH])

    const onNumberClicked = (number: InputNumber) => onAction({ type: ACTION_TYPES.ON_NUMBER_CLICK, payload: number })

    const onEraserClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_ERASE_CLICK })
    }, [onAction])

    const renderEraser = () => (
        <Button
            key="erase_cell"
            type={BUTTON_TYPES.TONAL}
            state={disableEraser ? BUTTON_STATES.DISABLED : BUTTON_STATES.ENABLED}
            containerStyle={styles.numberButtonContainer}
            onPress={onEraserClick}
            testID={INPUT_PANEL_ITEM_TEST_ID}
        >
            <Image style={[styles.eraser as ImageStyle, disableEraser ? { opacity: 0.5 } : null]} source={ERASER_SOURCE} />
        </Button>
    )

    const getButtonState = (number: InputNumber) => {
        if (disableNumbersInput) return BUTTON_STATES.DISABLED
        return numbersVisible[number] ? BUTTON_STATES.ENABLED : BUTTON_STATES.DISABLED
    }

    const renderInputNumber = (number: InputNumber) => (
        <Button
            key={`${number}`}
            type={BUTTON_TYPES.TONAL}
            state={getButtonState(number)}
            containerStyle={styles.numberButtonContainer}
            onPress={() => onNumberClicked(number)}
            label={`${number}`}
            textStyles={styles.textStyle}
            textType={TEXT_VARIATIONS.DISPLAY_SMALL}
            testID={INPUT_PANEL_ITEM_TEST_ID}
        />
    )

    const renderHorizontalSeparator = () => <View key="hori_seperator" style={styles.horizontalSeperator} />

    const renderPanelRow = (rowItems: React.ReactElement[], key: string) => (
        <View key={key} style={styles.rowContainer}>
            {rowItems}
        </View>
    )

    const renderPanelView = () => {
        const rows = []
        let rowItems: React.ReactElement[] = []
        BoardIterators.forCellEachNote(number => {
            if (shouldAddNumberInPanel(number)) rowItems.push(renderInputNumber(number))
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

    return (
        <View style={styles.container} testID={INPUT_PANEL_CONTAINER_TEST_ID}>
            {renderPanelView()}
        </View>
    )
}

export const Inputpanel = React.memo(Inputpanel_)
