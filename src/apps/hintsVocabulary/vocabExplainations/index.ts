import { HINTS_VOCAB_IDS } from '../../arena/utils/smartHints/rawHintTransformers'

import Candidate from './candidate'
import Cell from './cell'

export const VOCAB_COMPONENTS = {
    [HINTS_VOCAB_IDS.CANDIDATE]: Candidate,
    [HINTS_VOCAB_IDS.CELL]: Cell,
}
