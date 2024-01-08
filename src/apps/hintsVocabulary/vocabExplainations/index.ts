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
import HiddenTripple from './hiddenTripple'
import Chain from './chain'
import ChainLinks from './chainLinks'
import RemotePairs from './remotePairs'
import XChain from './xChain'
import XYChain from './xyChain'
import PerfectXWing from './perfectXWing'
import FinnedXWing from './finnedXWing'
import SashimiFinnedXWing from './sashimiFinnedXWing'

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
    [HINTS_VOCAB_IDS.HIDDEN_TRIPPLE]: HiddenTripple,
    [HINTS_VOCAB_IDS.CHAIN]: Chain,
    [HINTS_VOCAB_IDS.CHAIN_LINKS]: ChainLinks,
    [HINTS_VOCAB_IDS.REMOTE_PAIRS]: RemotePairs,
    [HINTS_VOCAB_IDS.X_CHAIN]: XChain,
    [HINTS_VOCAB_IDS.XY_CHAIN]: XYChain,
    [HINTS_VOCAB_IDS.PERFECT_X_WING]: PerfectXWing,
    [HINTS_VOCAB_IDS.FINNED_X_WING]: FinnedXWing,
    [HINTS_VOCAB_IDS.SASHIMI_FINNED_X_WING]: SashimiFinnedXWing,
}
