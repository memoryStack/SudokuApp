import _isEmpty from 'lodash/src/utils/isEmpty'
import _map from 'lodash/src/utils/map'

import { getNakedSingleRawHints } from './nakedSingle/nakedSingle'
import { getHiddenSingleRawHints } from './hiddenSingle/hiddenSingle'
import { getNakedGroupRawHints } from './nakedGroup/nakedGroup'
import { getHiddenGroupRawHints } from './hiddenGroup/hiddenGroup'
import { getXWingRawHints } from './xWing'
import { getYWingRawHints } from './yWing/yWing'
import { getOmissionRawHints } from './omission/omission'
import { getRemotePairsRawHints } from './remotePairs/remotePairs'

import {
    transformNakedSingleRawHint,
    transformHiddenSingleRawHint,
    transformNakedGroupRawHint,
    transformHiddenGroupRawHint,
    transformXWingRawHint,
    transformYWingRawHint,
    transformOmissionRawHint,
} from './rawHintTransformers'

import { GROUPS, HINTS_IDS, UI_HINTS_COUNT_THRESHOLD } from './constants'

export const getRawHints = async (hintId, mainNumbers, notesData) => {
    const handler = HINT_ID_VS_HANDLERS[hintId]
    return handler && handler(mainNumbers, notesData)
}

export const getTransformedRawHints = (hintId, rawHints, mainNumbers, notesData) => {
    if (_isEmpty(rawHints)) return null
    return _map(rawHints, rawHint => HINT_ID_VS_RAW_HINT_TRANSFORMERS[hintId]({ rawHint, mainNumbers, notesData }))
}

// TODO: fix the contract of this module. it returns null and receiving all
// sorts of things from it's dependent modules
const HINT_ID_VS_HANDLERS = {
    [HINTS_IDS.NAKED_SINGLE]: (mainNumbers, notesData) =>
        getNakedSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.HIDDEN_SINGLE]: (mainNumbers, notesData) =>
        getHiddenSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.NAKED_DOUBLE]: (mainNumbers, notesData) =>
        HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](2, mainNumbers, notesData),
    [HINTS_IDS.HIDDEN_DOUBLE]: (mainNumbers, notesData) =>
        HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](2, mainNumbers, notesData),
    [HINTS_IDS.NAKED_TRIPPLE]: (mainNumbers, notesData) =>
        HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](3, mainNumbers, notesData),
    [HINTS_IDS.HIDDEN_TRIPPLE]: (mainNumbers, notesData) =>
        HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](3, mainNumbers, notesData),
    [GROUPS.NAKED_GROUP]: (candidatesCount, mainNumbers, notesData) =>
        getNakedGroupRawHints(candidatesCount, notesData, mainNumbers, UI_HINTS_COUNT_THRESHOLD),
    [GROUPS.HIDDEN_GROUP]: (candidatesCount, mainNumbers, notesData) =>
        getHiddenGroupRawHints(candidatesCount, notesData, mainNumbers, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.X_WING]: (mainNumbers, notesData) => getXWingRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.Y_WING]: (mainNumbers, notesData) => getYWingRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.OMISSION]: (mainNumbers, notesData) =>
        getOmissionRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
    [HINTS_IDS.REMOTE_PAIRS]: (mainNumbers, notesData) =>
        getRemotePairsRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD),
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
}
