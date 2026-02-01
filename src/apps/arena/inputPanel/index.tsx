import React, { useCallback, useMemo } from 'react'

import { View, Image, ImageStyle, TextStyle, StyleProp, ViewStyle } from 'react-native'

import _noop from '@lodash/noop'

import { BoardIterators, CellEachNoteCallback } from '@domain/board/utils/boardIterators'

import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { OnAction } from '@utils/hocs/withActions/types'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { getStyles } from './inputPanel.styles'
import { ACTION_TYPES, INPUT_PANEL_CONTAINER_TEST_ID, INPUT_PANEL_ITEM_TEST_ID, INPUT_PANEL_REMAINING_COUNT_TEST_ID } from './constants'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ERASER_SOURCE = require('@resources/assets/eraser.png')

export type InputNumber = Parameters<CellEachNoteCallback>[0]

/** remainingCounts[1]..remainingCounts[9] = remaining instances to fill for digit 1..9 */
interface Props {
    numbersVisible?: InputPanelVisibleNumbers
    onAction?: OnAction
    singleRow?: boolean
    disableNumbersInput?: boolean
    disableEraser?: boolean
    shouldAddNumberInPanel: (number: number) => boolean
    cellWidth?: number
    textType?: TEXT_VARIATIONS
    remainingCountTextType?: TEXT_VARIATIONS
    numOfRows?: number,
    addEraser?: boolean,
    lockedNumber?: number
    showRemainingCount?: boolean
    remainingCounts?: number[]
    customStyles?: {
        numberButtonContainer?: StyleProp<ViewStyle>,
        horizontalSeperator?: StyleProp<ViewStyle>,
        eraserContainer?: StyleProp<ViewStyle>,
        // rowContainer?: StyleProp<ViewStyle>,
        // numberWithCountContainer?: StyleProp<ViewStyle>,
        // remainingCountText?: StyleProp<TextStyle>,
        // textStyle?: StyleProp<TextStyle>,
        // eraser?: StyleProp<ImageStyle>,
    }
}

const Inputpanel_: React.FC<Props> = ({
    numbersVisible = new Array(10).fill(true),
    onAction = _noop,
    singleRow = false,
    disableNumbersInput = false,
    disableEraser = false,
    shouldAddNumberInPanel = _noop,
    cellWidth,
    textType,
    remainingCountTextType = TEXT_VARIATIONS.BODY_SMALL,
    numOfRows = 2,
    addEraser = true,
    lockedNumber,
    showRemainingCount = false,
    remainingCounts,
    customStyles = {}
}) => {
    const { CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => getStyles(cellWidth ?? CELL_WIDTH), [cellWidth, CELL_WIDTH])

    const onNumberClicked = (number: InputNumber, isLongPress: boolean) => {
        onAction({
            type: ACTION_TYPES.ON_NUMBER_CLICK,
            payload: {
                number,
                isLongPress
            }
        })
    }

    const onEraserClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_ERASE_CLICK })
    }, [onAction])

    const renderEraser = () => (
        <Button
            key="erase_cell"
            type={BUTTON_TYPES.TONAL}
            state={disableEraser ? BUTTON_STATES.DISABLED : BUTTON_STATES.ENABLED}
            containerStyle={[styles.numberButtonContainer, customStyles.eraserContainer]}
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

    const renderInputNumber = (number: InputNumber) => {
        const showCount = showRemainingCount && remainingCounts != null && remainingCounts[number] != null
        return (
            <Button
                key={`${number}`}
                type={number === lockedNumber ? BUTTON_TYPES.FILLED : BUTTON_TYPES.TONAL}
                state={getButtonState(number)}
                containerStyle={[styles.numberButtonContainer, customStyles.numberButtonContainer]}
                onPress={() => onNumberClicked(number, false)}
                onLongPress={() => onNumberClicked(number, true)}
                label={showCount ? undefined : `${number}`}
                textStyles={styles.textStyle}
                textType={textType ?? TEXT_VARIATIONS.DISPLAY_SMALL}
                testID={INPUT_PANEL_ITEM_TEST_ID}
                renderChildren={(textStyles: TextStyle) => {
                    if (showCount) {
                        return (
                            <View style={styles.numberWithCountContainer}>
                                <Text
                                    style={[textStyles]}
                                    type={textType ?? TEXT_VARIATIONS.DISPLAY_SMALL}
                                    withoutLineHeight
                                    testID={`${INPUT_PANEL_ITEM_TEST_ID}-${number}`}
                                >
                                    {number}
                                </Text>
                                <Text
                                    type={remainingCountTextType}
                                    style={[styles.remainingCountText, textStyles]}
                                    testID={`${INPUT_PANEL_REMAINING_COUNT_TEST_ID}-${number}`}
                                    withoutLineHeight
                                >
                                    {remainingCounts![number]}
                                </Text>
                            </View>
                        )
                    }
                    return undefined
                }}
            />
        )
    }

    const renderHorizontalSeparator = (keySuffix = '') => <View key={`hori_seperator-${keySuffix}`} style={[styles.horizontalSeperator, customStyles.horizontalSeperator]} />

    const renderPanelRow = (rowItems: React.ReactElement[], key: string) => (
        <View key={key} style={styles.rowContainer}>
            {rowItems}
        </View>
    )

    const itemsInRow = numOfRows === 2 ? 5 : 3

    const renderPanelView = () => {
        const rows = []
        let rowItems: React.ReactElement[] = []
        BoardIterators.forCellEachNote(number => {
            if (shouldAddNumberInPanel(number)) rowItems.push(renderInputNumber(number))
            if (rowItems.length >= itemsInRow && !singleRow) {
                rows.push(renderPanelRow(rowItems, `row-${rows.length}`))
                rows.push(renderHorizontalSeparator(`${rows.length}`))
                rowItems = []
            }
        })

        addEraser && rowItems.push(renderEraser())
        rows.push(renderPanelRow(rowItems, `row-${numOfRows}`))
        return rows
    }

    return (
        <View style={styles.container} testID={INPUT_PANEL_CONTAINER_TEST_ID}>
            {renderPanelView()}
        </View>
    )
}

export const Inputpanel = React.memo(Inputpanel_)
