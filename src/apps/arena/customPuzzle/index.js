import React, { useCallback, useRef, useEffect } from 'react'

import { View, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { CloseIcon } from '@resources/svgIcons/close'
import { PLAY } from '@resources/stringLiterals'
import { fonts } from '@resources/fonts/font'
import { GAME_STATE } from '@resources/constants'
import withActions from '../../../utils/hocs/withActions'
import { Button } from '../../../components/button'

import { BottomDragger } from '../../components/BottomDragger'
import { Touchable } from '../../components/Touchable'

import { Board } from '../gameBoard'
import { Inputpanel } from '../inputPanel'

import { ACTION_HANDLERS, ACTION_TYPES, getInitialState } from './actionHandlers'
import { CLOSE_ICON_TEST_ID, CUSTOM_PUZZLE_TEST_ID } from './customPuzzle.constants'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: '3%', // 94% is te grid size
    },
    closeIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 24,
    },
    playButtonContainer: {
        paddingHorizontal: 24,
    },
    snackBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 24,
        backgroundColor: 'rgba(0, 0, 0, .9)', // replace this after talking to designer
        position: 'absolute',
        bottom: 150,
        alignSelf: 'center',
    },
    snackBarText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontFamily: fonts.regular,
    },
})

const CustomPuzzle_ = ({
    mainNumbers,
    selectedCell,
    notes,
    parentHeight,
    onCustomPuzzleClosed,
    onAction,
}) => {
    const customPuzzleRef = useRef(null)

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT })
    }, [])

    const handleOnClose = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: customPuzzleRef })
    }, [onAction])

    const handlePlayClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PLAY, payload: { ref: customPuzzleRef } })
    }, [mainNumbers])

    const onHCClosed = useCallback(() => {
        onCustomPuzzleClosed()
    }, [])

    const onCellClick = useCallback(
        cell => {
            onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
        },
        [onAction],
    )

    return (
        <BottomDragger
            ref={customPuzzleRef}
            parentHeight={parentHeight}
            onDraggerClosed={onHCClosed}
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
                    <CloseIcon height={24} width={24} fill="rgba(0, 0, 0, .8)" />
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
                <Button containerStyle={styles.playButtonContainer} onClick={handlePlayClick} text={PLAY} />
            </View>
        </BottomDragger>
    )
}

export const CustomPuzzle = React.memo(
    withActions({ actionHandlers: ACTION_HANDLERS, initialState: getInitialState() })(CustomPuzzle_),
)

CustomPuzzle_.propTypes = {
    onAction: PropTypes.func,
    onCustomPuzzleClosed: PropTypes.func,
    selectedCell: PropTypes.object,
    parentHeight: PropTypes.number,
}

CustomPuzzle_.defaultProps = {
    onAction: _noop,
    onCustomPuzzleClosed: _noop,
    parentHeight: 0,
    selectedCell: {},
}
