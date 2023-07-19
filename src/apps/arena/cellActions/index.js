import React, { useEffect } from 'react'

import { View, StyleSheet, useWindowDimensions } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PENCIL_STATE } from '@resources/constants'

import withActions from '../../../utils/hocs/withActions'

import { getAvailableHintsCount, getPencilStatus } from '../store/selectors/boardController.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { useCacheGameState } from '../hooks/useCacheGameState'
import { getGameState } from '../store/selectors/gameState.selectors'
import { GameState } from '../utils/classes/gameState'

import Undo from './Undo'
import Pencil from './Pencil'
import FastPencil from './FastPencil'
import Hint from './Hint'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { BOARD_CONTROLLER_TEST_ID, BOARD_CONTROLLER_CONTAINER_TEST_ID } from './cellActions.constants'

const styles = StyleSheet.create({
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
})

const BoardController_ = ({ onAction }) => {
    const pencilState = useSelector(getPencilStatus)
    const hints = useSelector(getAvailableHintsCount)

    const gameState = useSelector(getGameState)

    const disableControllers = !(new GameState(gameState).isGameActive())

    useCacheGameState(GAME_DATA_KEYS.CELL_ACTIONS, { pencilState, hints })

    useEffect(() => () => {
        onAction({ type: ACTION_TYPES.ON_UNMOUNT })
    }, [onAction])

    const { width: windowWidth } = useWindowDimensions()
    const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5

    const onUndoClick = () => onAction({ type: ACTION_TYPES.ON_UNDO_CLICK })

    const onPencilClick = () => onAction({ type: ACTION_TYPES.ON_PENCIL_CLICK })

    const onFastPencilClick = () => onAction({ type: ACTION_TYPES.ON_FAST_PENCIL_CLICK })

    const onHintClick = () => onAction({ type: ACTION_TYPES.ON_HINT_CLICK })

    // TODO: use a single component for these 4 components, and use them via a config
    return (
        <View style={styles.cellActionsContainer} testID={BOARD_CONTROLLER_CONTAINER_TEST_ID}>
            <Undo
                disabled={disableControllers}
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                onClick={onUndoClick}
                testID={BOARD_CONTROLLER_TEST_ID}
            />
            <Pencil
                disabled={disableControllers}
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                isActive={pencilState === PENCIL_STATE.ACTIVE}
                onClick={onPencilClick}
                testID={BOARD_CONTROLLER_TEST_ID}
            />
            <FastPencil
                disabled={disableControllers}
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                onClick={onFastPencilClick}
                testID={BOARD_CONTROLLER_TEST_ID}
            />
            <Hint
                disabled={disableControllers}
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                hints={hints}
                onClick={onHintClick}
                testID={BOARD_CONTROLLER_TEST_ID}
            />
        </View>
    )
}

export const BoardController = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(BoardController_))

BoardController_.propTypes = {
    onAction: PropTypes.func,
}

BoardController_.defaultProps = {
    onAction: _noop,
}
