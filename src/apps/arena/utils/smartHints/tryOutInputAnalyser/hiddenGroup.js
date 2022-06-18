import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { HINT_TEXT_CANDIDATES_JOIN_CONJUGATION } from '../constants'
import { getCandidatesListText } from '../util'
import { TRY_OUT_RESULT_STATES } from './constants'
import { getCandidatesToBeFilled, getCellsAxesValuesListText, getCorrectFilledTryOutCandidates, noInputInTryOut } from './helpers'

const tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells, removableCandidates }) => {

    if (noInputInTryOut(groupCells)) {
        // TODO: check if direct details of numbers and cells
        //         should be injected in this example
        return {
            msg: `try filling these numbers in the cells where these are`
                + ` highlighted in red or green color to see why green numbers stays`
                + ` and red numbers will be removed`,
            state: TRY_OUT_RESULT_STATES.START,
        }
    }

    // const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    // const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    // if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
    //     // return getAllInputsFilledResult(groupCandidates)
    // } else {
    //     const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
    //     // return getPartialCorrectlyFilledResult(candidatesToBeFilled)
    // }

    return {
        msg: 'LOGIC COMING SOON',
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

export default tryOutAnalyser
