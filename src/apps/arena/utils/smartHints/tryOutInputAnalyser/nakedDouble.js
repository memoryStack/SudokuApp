import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { isCellEmpty } from '../../util'
import { TRY_OUT_RESULT_STATES } from './constants'
import { noInputInTryOut, getTryOutErrorType, getNakedGroupNoTryOutInputResult, getTryOutErrorResult } from './helpers'

const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {

    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    const tryOutErrorType = getTryOutErrorType(groupCandidates, focusedCells)
    if (tryOutErrorType) {
        return getTryOutErrorResult(tryOutErrorType)
    }

    // one or more candidates are filled in correct place. prepare messages for this state.
    // TODO: replace it with the newly added helper func for this purpose
    const getFilledCandidatesListForGreenState = candidates => {
        if (candidates.length === 1) return `${candidates[0]}`

        return candidates.reduce((prevValue, currentCandidate, currentIndex) => {
            if (currentIndex === 0) return currentCandidate

            const isLastElement = currentIndex === candidates.length - 1
            const joint = isLastElement ? ' and ' : ', '
            return prevValue + joint + currentCandidate
        }, '')
    }

    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        return {
            msg:
                `${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)} are filled in` +
                ` these cells without any error. now we are sure` +
                ` that ${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)}` +
                ` can't come in cells where these were highlighted in red`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    } else {
        const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
        return {
            msg:
                `fill ${getFilledCandidatesListForGreenState(candidatesToBeFilled)} as well` +
                ` to find where these numbers can't come in the highlighted region.`,
            state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
        }
    }
}

const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach(cell => {
        if (!isCellEmpty(cell, tryOutMainNumbers)) {
            result.push(tryOutMainNumbers[cell.row][cell.col].value)
        }
    })
    return result
}

const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => {
    return groupCandidates
        .map(candidate => {
            return parseInt(candidate, 10)
        })
        .filter(groupCandidate => {
            return !correctlyFilledGroupCandidates.includes(groupCandidate)
        })
}

export default tryOutAnalyser
