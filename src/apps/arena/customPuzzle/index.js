import React, { useCallback, useRef, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { CloseIcon } from '@resources/svgIcons/close'
import { PLAY } from '@resources/stringLiterals'
import Button from '@ui/molecules/Button'
import { useStyles } from '@utils/customHooks/useStyles'
import withActions from '../../../utils/hocs/withActions'
import { BottomDragger } from '../../components/BottomDragger'
import { Touchable } from '../../components/Touchable'
import { Board } from '../gameBoard'
import { Inputpanel } from '../inputPanel'
import { ACTION_HANDLERS, ACTION_TYPES, getInitialState } from './actionHandlers'
import { CLOSE_ICON_TEST_ID, CUSTOM_PUZZLE_TEST_ID } from './customPuzzle.constants'
import { getStyles } from './customPuzzle.styles'
import { areMultipleMainNumbersInAnyHouseOfCell, areSameCells } from '../utils/util'
import { useDependency } from 'src/hooks/useDependency'
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { useSelector } from 'react-redux'
import { getLockedNumber } from '../store/selectors/inputPanel.selectors'

const CustomPuzzle_ = ({
    mainNumbers,
    notes,
    selectedCell,
    parentHeight,
    onCustomPuzzleClosed,
    onAction,
}) => {
    const dependencies = useDependency()

    const { number: lockedNumber } = useSelector(getLockedNumber)

    const styles = useStyles(getStyles)

    const customPuzzleRef = useRef(null)

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: { dependencies } })
    }, [onAction])

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    const handleOnClose = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: customPuzzleRef })
    }, [onAction])

    const handlePlayClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PLAY, payload: { ref: customPuzzleRef, dependencies } })
    }, [onAction, dependencies])

    const onCellClick = useCallback(cell => {
        onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: { cell, dependencies } })
    }, [onAction])

    const getCellBGColor = cell => {
        if (areSameCells(cell, selectedCell)) return styles.selectedCellBGColor
        return styles.defaultCellBGColor
    }

    const getCustomPuzzleMainNumFontColor = cell => {
        const cellNumber = MainNumbersRecord.getCellMainValue(mainNumbers, cell)
        if (
            MainNumbersRecord.isCellFilled(mainNumbers, cell)
            && areMultipleMainNumbersInAnyHouseOfCell(mainNumbers, cell, cellNumber)
        ) return styles.wronglyFilledNumColor
        return styles.clueNumColor
    }

    const shouldAddNumberInPanel = useCallback(() => true, [])

    return (
        <BottomDragger
            ref={customPuzzleRef}
            parentHeight={parentHeight}
            onDraggerClosed={onCustomPuzzleClosed}
            stopBackgroundClickClose
            testID={CUSTOM_PUZZLE_TEST_ID}
        >
            <View style={styles.container}>
                <Touchable
                    style={styles.closeIconContainer}
                    onPress={handleOnClose}
                    addHitSlop
                    testID={CLOSE_ICON_TEST_ID}
                >
                    <CloseIcon height={24} width={24} fill={styles.closeIcon.color} />
                </Touchable>
                <View style={{
                    marginLeft: -STATIC_BOARD_ELEMENTS_DIMENSIONS.AXIS_WIDTH_HALVE
                }}>
                    <Board
                        showCellContent
                        mainNumbers={mainNumbers}
                        notes={notes}
                        onCellClick={onCellClick}
                        getCellBGColor={getCellBGColor}
                        getCellMainNumberFontColor={getCustomPuzzleMainNumFontColor}
                    />
                </View>
                <View style={styles.inputPanelContainer}>
                    <Inputpanel
                        onAction={onAction}
                        shouldAddNumberInPanel={shouldAddNumberInPanel}
                        lockedNumber={lockedNumber}
                    />
                </View>
                <Button containerStyle={styles.playButtonContainer} onPress={handlePlayClick} label={PLAY} />
            </View>
        </BottomDragger>
    )
}

export const CustomPuzzle = React.memo(
    withActions({ actionHandlers: ACTION_HANDLERS, initialState: getInitialState() })(CustomPuzzle_),
)

CustomPuzzle_.propTypes = {
    mainNumbers: PropTypes.array,
    notes: PropTypes.array,
    onAction: PropTypes.func,
    onCustomPuzzleClosed: PropTypes.func,
    selectedCell: PropTypes.object,
    parentHeight: PropTypes.number,
}

CustomPuzzle_.defaultProps = {
    mainNumbers: [],
    notes: [],
    onAction: _noop,
    onCustomPuzzleClosed: _noop,
    parentHeight: 0,
    selectedCell: {},
}
