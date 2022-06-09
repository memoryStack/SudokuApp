import { getTryOutMainNumbers } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import { isCellEmpty } from '../../util'
import { TRY_OUT_RESULT_STATES, TRY_OUT_ERROR_TYPES_VS_ERROR_MSG } from './constants'
import { noInputInTryOut, getTryOutErrorType, getNakedGroupNoTryOutInputResult } from './helpers'

export default tryOutAnalyser = ({ groupCandidates, focusedCells, groupCells, }) => {

    if (noInputInTryOut(focusedCells)) {
        return getNakedGroupNoTryOutInputResult(groupCandidates)
    }

    return {
        msg: 'some logic is coming soon',
        state: '',
    }

}
