import _isEmpty from '@lodash/isEmpty'
import _map from '@lodash/map'
import _noop from '@lodash/noop'

import { getNakedSingleRawHints } from './nakedSingle/nakedSingle'
import { getHiddenSingleRawHints } from './hiddenSingle/hiddenSingle'
import { getNakedGroupRawHints } from './nakedGroup/nakedGroup'
import { getHiddenGroupRawHints } from './hiddenGroup/hiddenGroup'
import { getXWingRawHints } from './xWing'
import { getYWingRawHints } from './yWing/yWing'
import { getOmissionRawHints } from './omission/omission'
import { getRemotePairsRawHints } from './remotePairs/remotePairs'
import { getEmptyRectangleRawHints } from './emptyRectangle'
import { getRawXChainHints } from './xChain'

import {
    transformNakedSingleRawHint,
    transformHiddenSingleRawHint,
    transformNakedGroupRawHint,
    transformHiddenGroupRawHint,
    transformXWingRawHint,
    transformYWingRawHint,
    transformOmissionRawHint,
    transformRemotePairsRawHint,
    transformXChainRawHint,
} from './rawHintTransformers'

import { GROUPS, HINTS_IDS, UI_HINTS_COUNT_THRESHOLD } from './constants'
import { NotesRecord } from '../../RecordUtilities/boardNotes'

export const getRawHints = async (hintId, mainNumbers, notesData) => {
    const handler = HINT_ID_VS_HANDLERS[hintId] || _noop
    const possibleNotes = NotesRecord.initPossibleNotes(mainNumbers)
    return handler(mainNumbers, notesData, possibleNotes)
}

export const getTransformedRawHints = (hintId, rawHints, mainNumbers, notesData, smartHintsColorSystem) => {
    if (_isEmpty(rawHints)) return null
    return _map(rawHints, rawHint => HINT_ID_VS_RAW_HINT_TRANSFORMERS[hintId]({
        rawHint, mainNumbers, notesData, smartHintsColorSystem,
    }))
}

// TODO: fix the contract of this module. it returns null and receiving all
// sorts of things from it's dependent modules
const HINT_ID_VS_HANDLERS = {
    [HINTS_IDS.NAKED_SINGLE]: (mainNumbers, notesData, possibleNotes) => getNakedSingleRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.HIDDEN_SINGLE]: (mainNumbers, notesData, possibleNotes) => getHiddenSingleRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.NAKED_DOUBLE]: (mainNumbers, notesData, possibleNotes) => HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](2, mainNumbers, notesData, possibleNotes),
    [HINTS_IDS.NAKED_TRIPPLE]: (mainNumbers, notesData, possibleNotes) => HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](3, mainNumbers, notesData, possibleNotes),
    [HINTS_IDS.HIDDEN_DOUBLE]: (mainNumbers, notesData, possibleNotes) => HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](2, mainNumbers, notesData, possibleNotes),
    [HINTS_IDS.HIDDEN_TRIPPLE]: (mainNumbers, notesData, possibleNotes) => HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](3, mainNumbers, notesData, possibleNotes),
    [GROUPS.NAKED_GROUP]: (candidatesCount, mainNumbers, notesData, possibleNotes) => getNakedGroupRawHints(candidatesCount, notesData, mainNumbers, possibleNotes),
    [GROUPS.HIDDEN_GROUP]: (candidatesCount, mainNumbers, notesData, possibleNotes) => getHiddenGroupRawHints(candidatesCount, notesData, mainNumbers, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.X_WING]: (mainNumbers, notesData, possibleNotes) => getXWingRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.Y_WING]: (mainNumbers, notesData, possibleNotes) => getYWingRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.OMISSION]: (mainNumbers, notesData, possibleNotes) => getOmissionRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.REMOTE_PAIRS]: (mainNumbers, notesData, possibleNotes) => getRemotePairsRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.EMPTY_RECTANGLE]: (mainNumbers, notesData, possibleNotes) => getEmptyRectangleRawHints(mainNumbers, notesData, possibleNotes, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.X_CHAIN]: (mainNumbers, notesData, possibleNotes) => getRawXChainHints(mainNumbers, notesData, possibleNotes),
}

const HINT_ID_VS_RAW_HINT_TRANSFORMERS = {
    [HINTS_IDS.NAKED_SINGLE]: transformNakedSingleRawHint,
    [HINTS_IDS.HIDDEN_SINGLE]: transformHiddenSingleRawHint,
    [HINTS_IDS.NAKED_DOUBLE]: transformNakedGroupRawHint,
    [HINTS_IDS.NAKED_TRIPPLE]: transformNakedGroupRawHint,
    [HINTS_IDS.HIDDEN_DOUBLE]: transformHiddenGroupRawHint,
    [HINTS_IDS.HIDDEN_TRIPPLE]: transformHiddenGroupRawHint,
    [HINTS_IDS.X_WING]: transformXWingRawHint,
    [HINTS_IDS.Y_WING]: transformYWingRawHint,
    [HINTS_IDS.OMISSION]: transformOmissionRawHint,
    [HINTS_IDS.REMOTE_PAIRS]: transformRemotePairsRawHint,
    [HINTS_IDS.X_CHAIN]: transformXChainRawHint,
}
