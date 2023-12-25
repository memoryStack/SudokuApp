import { HINTS_VOCAB_IDS } from '../../arena/utils/smartHints/rawHintTransformers'

import Candidate from './candidate'
import House from './house'
import Cell from './cell'
import Row from './row'
import Column from './column'
import Block from './block'
import NakedSingle from './nakedSingle'
import NakedDouble from './nakedDouble'
import NakedTripple from './nakedTripple'
import HiddenSingle from './hiddenSingle'
import HiddenDouble from './hiddenDouble'
// import Omission from './omission'

export const VOCAB_COMPONENTS = {
    [HINTS_VOCAB_IDS.CANDIDATE]: Candidate,
    [HINTS_VOCAB_IDS.HOUSE]: House,
    [HINTS_VOCAB_IDS.CELL]: Cell,
    [HINTS_VOCAB_IDS.ROW]: Row,
    [HINTS_VOCAB_IDS.COLUMN]: Column,
    [HINTS_VOCAB_IDS.BLOCK]: Block,
    [HINTS_VOCAB_IDS.NAKED_SINGLE]: NakedSingle,
    [HINTS_VOCAB_IDS.NAKED_DOUBLE]: NakedDouble,
    [HINTS_VOCAB_IDS.NAKED_TRIPPLE]: NakedTripple,
    [HINTS_VOCAB_IDS.HIDDEN_SINGLE]: HiddenSingle,
    [HINTS_VOCAB_IDS.HIDDEN_DOUBLE]: HiddenDouble,
    // [HINTS_VOCAB_IDS.OMISSION]: Omission,
}
