import { isCellEmpty, getCellVisibleNotesCount, isCellNoteVisible } from '../../util'
import { getMainNumbers } from '../../../store/selectors/board.selectors'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES } from './constants'

// TODO: move it to utils for other hints to use
// TODO: don't pass the global data in the args like tryOutMainNumbers
const noInputInTryOut = (tryOutMainNumbers, focusedCells) => {
    const actualMainNumbers = getMainNumbers(getStoreState())

    const result = []
    focusedCells.forEach((cell) => {
        const isCellFilledInTryOut = isCellEmpty(cell, actualMainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
        if (isCellFilledInTryOut) {
            result.push({
                cell,
                number: tryOutMainNumbers[cell.row][cell.col].value
            })
        }
    })

    return result.length === 0
}

const getTryOutErrorType = (tryOutMainNumbers, tryOutNotesInfo, groupCandidates, focusedCells) => {
    // these errors can be put in utils individually
    const cellWithoutAnyCandidates = focusedCells.some((cell) => {
        return isCellEmpty(cell, tryOutMainNumbers) && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0)
    })
    if (cellWithoutAnyCandidates) {
        return TRY_OUT_ERROR_TYPES.EMPTY_CELL_IN_SOLUTION
    }

    const candidatesNakedSingleInMultipleCells = groupCandidates.filter((candidate) => {
        const candidateNakedSingleHostCells = focusedCells.filter((cell) => {
            return isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col])
                && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1)
        })
        return candidateNakedSingleHostCells.length > 1
    })
    if (candidatesNakedSingleInMultipleCells.length) {
        return TRY_OUT_ERROR_TYPES.MULTIPLE_CELLS_NAKED_SINGLE
    }

    return ''
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

 const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells }) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())

    const getCandidatesListForTryOutMsg = () => {
        const isNakedDoubles = groupCandidates.length === 2
        return isNakedDoubles
            ? `${groupCandidates[0]} or ${groupCandidates[1]}`
            : `${groupCandidates[0]}, ${groupCandidates[1]} or ${groupCandidates[2]}`
    }

    if (noInputInTryOut(tryOutMainNumbers, focusedCells)) {
        return {
            msg: `try filling ${getCandidatesListForTryOutMsg()} in the cells where`
                + ` it is highlighted in red or green color to see how this hint works`,
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    const tryOutErrorType = getTryOutErrorType(tryOutMainNumbers, tryOutNotesInfo, groupCandidates, focusedCells)

    // switch kind of handling
    // display these kind of messages in red color
    if (tryOutErrorType === MULTIPLE_CELLS_NAKED_SINGLE.EMPTY_CELL_IN_SOLUTION) {
        return {
            msg: `one or more cells have no candidates in them. undo your move.`,
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
    } else if (tryOutErrorType ===  MULTIPLE_CELLS_NAKED_SINGLE.MULTIPLE_CELLS_NAKED_SINGLE) {
        return {
            msg: `candidate highlighted in green color can't be naked single for more than 1 cell in a house. undo your move.`,
            state: TRY_OUT_RESULT_STATES.ERROR,
        }
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

export default tryOutAnalyser
