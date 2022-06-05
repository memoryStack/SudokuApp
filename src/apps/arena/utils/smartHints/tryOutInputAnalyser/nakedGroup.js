import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { isCellEmpty } from '../../util'
import { TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES_VS_ERROR_MSG } from './constants'
import { noInputInTryOut, getTryOutErrorType } from './helpers'

const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())

    if (noInputInTryOut(focusedCells)) {
        return {
            msg: `try filling ${getCandidatesListForTryOutMsg(groupCandidates)} in the cells where`
                + ` it is highlighted in red or green color to see how this hint works`,
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    const tryOutErrorType = getTryOutErrorType(groupCandidates, focusedCells)
    if (tryOutErrorType) {
        return getTryOutErrorResult(tryOutErrorType)
    }

    // one or more candidates are filled in correct place. prepare messages for this state.
    const getFilledCandidatesListForGreenState = (candidates) => {
        if (candidates.length === 1) return `${candidates[0]}`

        return candidates.reduce((prevValue, currentCandidate, currentIndex) => {
            if (currentIndex === 0) return currentCandidate

            const isLastElement = currentIndex === candidates.length - 1
            const joint = isLastElement ? ' and ' : ', '
            return prevValue + joint + currentCandidate
        }, '')
    }

    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return {
            msg: `${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)} are filled in`
                +` these cells without any error. now we are sure`
                + ` that ${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)}`
                + ` can't come in cells where these were highlighted in red`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        return {
            msg: `fill ${getFilledCandidatesListForGreenState(candidatesToBeFilled)} as well`
                + ` to find where these numbers can't come in the highlighted region.`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }
}

const getCandidatesListForTryOutMsg = (candidates) => {
    const isNakedDoubles = candidates.length === 2
    return isNakedDoubles
        ? `${candidates[0]} or ${candidates[1]}`
        : `${candidates[0]}, ${candidates[1]} or ${candidates[2]}`
}

const getTryOutErrorResult = (errorType) => {
    return {
        msg: TRY_OUT_ERROR_TYPES_VS_ERROR_MSG[errorType],
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach((cell) => {
        if (!isCellEmpty(cell, tryOutMainNumbers)) {
            result.push( tryOutMainNumbers[cell.row][cell.col].value)
        }
    })
    return result
}

const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => {
    return groupCandidates.map((candidate) => {
        return parseInt(candidate, 10)
    }).filter((groupCandidate) => {
        return !correctlyFilledGroupCandidates.includes(groupCandidate)
    })
}

export default tryOutAnalyser
