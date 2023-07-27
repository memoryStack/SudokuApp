import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { useSelector } from 'react-redux'

import _noop from '@lodash/noop'
import _isEqual from '@lodash/isEqual'

import withActions from '../../../utils/hocs/withActions'

import { Inputpanel } from '../inputPanel'
import { MAX_INSTANCES_OF_NUMBER } from '../constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { GameState } from '../utils/classes/gameState'
import { getGameState } from '../store/selectors/gameState.selectors'

import { ACTION_HANDLERS } from './actionHandlers'
import { MainNumbersRecord } from '../RecordUtilities/boardMainNumbers'
import { BoardIterators } from '../utils/classes/boardIterators'

const getInstancesCounts = mainNumbers => {
    const instancesCount = new Array(10).fill(0)
    BoardIterators.forBoardEachCell(cell => {
        if (MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) {
            const value = MainNumbersRecord.getCellMainValue(mainNumbers, cell)
            instancesCount[value]++
        }
    })
    return instancesCount
}

const GameInputPanel_ = ({ onAction }) => {
    const { mainNumbers } = useGameBoardInputs()

    const gameState = useSelector(getGameState)
    const isGameActive = (new GameState(gameState).isGameActive())
    const [numbersVisible, setNumbersVisibility] = useState(new Array(10).fill(true))

    const getNumbersVisibilityStatus = instancesCount => {
        const numbersVisibility = [true]
        for (let i = 1; i <= MAX_INSTANCES_OF_NUMBER; i++) numbersVisibility.push(instancesCount[i] !== MAX_INSTANCES_OF_NUMBER)
        return numbersVisibility
    }

    useEffect(() => {
        const numbersNewVisibility = getNumbersVisibilityStatus(getInstancesCounts(mainNumbers))
        if (!_isEqual(numbersVisible, numbersNewVisibility)) setNumbersVisibility(numbersNewVisibility)
    }, [mainNumbers, numbersVisible])

    return (
        <Inputpanel
            numbersVisible={numbersVisible}
            onAction={onAction}
            disableNumbersInput={!isGameActive}
            disableEraser={!isGameActive}
        />
    )
}

export const GameInputPanel = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(GameInputPanel_))

GameInputPanel_.propTypes = {
    onAction: PropTypes.func,
}

GameInputPanel_.defaultProps = {
    onAction: _noop,
}
