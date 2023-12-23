import { HINTS_VOCAB_IDS } from '../../arena/utils/smartHints/rawHintTransformers'

import Candidate from './candidate'
import Cell from './cell'
import Row from './row'
import Column from './column'
import Block from './block'

export const VOCAB_COMPONENTS = {
    [HINTS_VOCAB_IDS.CANDIDATE]: Candidate,
    [HINTS_VOCAB_IDS.CELL]: Cell,
    [HINTS_VOCAB_IDS.ROW]: Row,
    [HINTS_VOCAB_IDS.COLUMN]: Column,
    [HINTS_VOCAB_IDS.BLOCK]: Block,
}
