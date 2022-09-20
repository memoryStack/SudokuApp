import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import withActions from '../../../utils/hocs/withActions'

import { Inputpanel } from '../inputPanel'
import { getMainNumbers } from '../store/selectors/board.selectors'
import { forBoardEachCell } from '../utils/util'
import { MAX_INSTANCES_OF_NUMBER } from '../constants'

import { ACTION_HANDLERS } from './actionHandlers'

const GameInputPanel_ = ({ onAction }) => {
    const mainNumbers = useSelector(getMainNumbers)
    const [numbersVisible, setNumbersVisibility] = useState(new Array(10).fill(true))

    const getInstancesCounts = mainNumbers => {
        const instancesCount = new Array(10).fill(0)
        forBoardEachCell(({ row, col }) => {
            const value = mainNumbers[row][col].value
            if (value === mainNumbers[row][col].solutionValue) {
                instancesCount[value]++
            }
        })
        return instancesCount
    }

    const getNumbersVisibilityStatus = instancesCount => {
        const numbersVisibility = [true]
        for (let i = 1; i <= MAX_INSTANCES_OF_NUMBER; i++)
            numbersVisibility.push(instancesCount[i] !== MAX_INSTANCES_OF_NUMBER)
        return numbersVisibility
    }

    useEffect(() => {
        const numbersNewVisibility = getNumbersVisibilityStatus(getInstancesCounts(mainNumbers))
        if (!numbersVisible.sameArrays(numbersNewVisibility)) setNumbersVisibility(numbersNewVisibility)
    }, [mainNumbers, numbersVisible])

    return <Inputpanel numbersVisible={numbersVisible} onAction={onAction} />
}

export const GameInputPanel = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(GameInputPanel_))

GameInputPanel_.propTypes = {
    onAction: PropTypes.func,
}

GameInputPanel_.defaultProps = {
    onAction: _noop,
}
