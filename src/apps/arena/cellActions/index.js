import React, { useEffect, useRef } from 'react'

import { View, useWindowDimensions } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import { useCopilot } from "react-native-copilot";

import _noop from '@lodash/noop'

import { PENCIL_STATE } from '@resources/constants'

import { useStyles } from '@utils/customHooks/useStyles'
import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { getAvailableHintsCount } from '../store/selectors/boardController.selectors'
import { GameState } from '@application/utils/gameState'

import Undo from './Undo'
import Pencil from './Pencil'
import FastPencil from './FastPencil'
import Hint from './Hint'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { BOARD_CONTROLLER_TEST_ID, BOARD_CONTROLLER_CONTAINER_TEST_ID } from './cellActions.constants'
import { getStyles } from './cellActions.styles'
import SpotlightTourProvider from 'src/containers/SpotlightTourProvider';
import { addListener, removeListener } from '@utils/GlobalEventBus';
import { EVENTS } from 'src/constants/events';
import _get from '@lodash/get';
import { useThemeValues } from '../hooks/useTheme';

const BoardController_ = ({ onAction, refFromParent, gameState, pencilState }) => {
    const dependencies = useDependency()

    const styles = useStyles(getStyles)

    const hints = useSelector(getAvailableHintsCount)

    const theme = useThemeValues()

    const { start, copilotEvents, currentStepNumber, totalStepsNumber, goToNext, stop, visible } = useCopilot()
    const wentoff = useRef(false)

    useEffect(() => {
        if (!visible) return
        const functionToCall = currentStepNumber !== totalStepsNumber ? goToNext : stop
        setTimeout(functionToCall, 3000)
    }, [currentStepNumber, totalStepsNumber, goToNext, stop, visible])

    useEffect(() => {
        copilotEvents.on("start", () => {
            dependencies?.analytics.sendHowToGetHintsCoachmarkVisibleEvent?.()
        })
        copilotEvents.on("stepChange", (step) => {
            dependencies?.analytics.sendHowToGetHintsCoachmarkStepChangeEvent?.({ name: step.name, position: step.order })
        })
        copilotEvents.on("stop", () => {
            dependencies?.analytics.sendHowToGetHintsCoachmarkCompletedEvent?.()
            dependencies?.coachMarksAdapter?.setUserLearnedToGetHints?.()
        })
    }, [copilotEvents])

    useEffect(() => {
        if (wentoff.current) return
        const handler = () => {
            start()
            wentoff.current = true
        }
        addListener(EVENTS.LOCAL.COACHMARKS.HOW_TO_GET_HINTS, handler)

        return () => {
            removeListener(EVENTS.LOCAL.COACHMARKS.HOW_TO_GET_HINTS, handler)
        }
    }, [start])

    const disableControllers = !(new GameState(gameState).isGameActive())

    const { width: windowWidth } = useWindowDimensions()
    const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5

    const onUndoClick = () => onAction({ type: ACTION_TYPES.ON_UNDO_CLICK, payload: { dependencies } })

    const onPencilClick = () => onAction({ type: ACTION_TYPES.ON_PENCIL_CLICK, payload: { dependencies } })

    const onFastPencilClick = () => onAction({ type: ACTION_TYPES.ON_FAST_PENCIL_CLICK, payload: { dependencies } })

    const onHintClick = (showAllHints = false) => {
        onAction({
            type: ACTION_TYPES.ON_HINT_CLICK,
            payload: {
                dependencies,
                smartHintsColorSystem: _get(theme, 'colors.smartHints'),
                showAllHints
            }
        })
    }

    // TODO: use a single component for these 4 components, and use them via a config
    return (
        <View
            ref={refFromParent}
            style={styles.cellActionsContainer}
            testID={BOARD_CONTROLLER_CONTAINER_TEST_ID}
        >
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

export const BoardControllerComp = withActions({ actionHandlers: ACTION_HANDLERS })(BoardController_)

const WrappedBoardController = ({ refFromParent, gameState, pencilState }) => {
    return (
        <SpotlightTourProvider showFooter={false}>
            <BoardControllerComp
                refFromParent={refFromParent}
                gameState={gameState}
                pencilState={pencilState}
            />
        </SpotlightTourProvider>
    )
}

export const BoardController = React.memo(WrappedBoardController)

BoardController_.propTypes = {
    onAction: PropTypes.func,
    refFromParent: PropTypes.object,
    gameState: PropTypes.string,
    pencilState: PropTypes.string,
}

BoardController_.defaultProps = {
    onAction: _noop,
    refFromParent: null,
}
