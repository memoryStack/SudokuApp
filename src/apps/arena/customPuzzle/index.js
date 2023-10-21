import React, { useCallback, useRef, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { CloseIcon } from '@resources/svgIcons/close'
import { PLAY } from '@resources/stringLiterals'
import { GAME_STATE } from '@resources/constants'
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

const CustomPuzzle_ = ({
    mainNumbers,
    notes,
    selectedCell,
    parentHeight,
    onCustomPuzzleClosed,
    onAction,
}) => {
    const styles = useStyles(getStyles)

    const customPuzzleRef = useRef(null)

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT })
    }, [onAction])

    const handleOnClose = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: customPuzzleRef })
    }, [onAction])

    const handlePlayClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PLAY, payload: { ref: customPuzzleRef } })
    }, [onAction])

    const onCellClick = useCallback(cell => {
        onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction])

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
                <Board
                    gameState={GAME_STATE.ACTIVE}
                    mainNumbers={mainNumbers}
                    notes={notes}
                    selectedCell={selectedCell}
                    onCellClick={onCellClick}
                    isCustomPuzleScreen
                />
                <View style={styles.inputPanelContainer}>
                    <Inputpanel onAction={onAction} />
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
