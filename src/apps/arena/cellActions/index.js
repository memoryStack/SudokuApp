import React, { useCallback, useEffect } from 'react'

import { View, StyleSheet, useWindowDimensions } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import withActions from '../../../utils/hocs/withActions'

import { getPencilStatus } from '../store/selectors/boardController.selectors'
import { GAME_DATA_KEYS } from '../utils/cacheGameHandler'
import { useCacheGameState } from '../hooks/useCacheGameState'

import { Undo } from './undo'
import { Pencil } from './pencil'
import { FastPencil } from './fastPencil'
import { Hint } from './hint'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'

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
    const hints = 3 // TODO: add proper logic for it

    useCacheGameState(GAME_DATA_KEYS.CELL_ACTIONS, { pencilState, hints })

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    const { width: windowWidth } = useWindowDimensions()
    const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5

    const onUndoClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_UNDO_CLICK })
    }, [onAction])

    const onPencilClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PENCIL_CLICK })
    }, [onAction])

    const onFastPencilClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_FAST_PENCIL_CLICK })
    }, [onAction])

    const onHintClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_HINT_CLICK })
    }, [onAction])

    return (
        <View style={styles.cellActionsContainer}>
            <Undo iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onUndoClick} />
            <Pencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} pencilState={pencilState} onClick={onPencilClick} />
            <FastPencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onFastPencilClick} />
            <Hint iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} hints={hints} onClick={onHintClick} />
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
