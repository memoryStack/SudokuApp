import _isEmpty from 'lodash/src/utils/isEmpty'
import _map from 'lodash/src/utils/map'
import _noop from 'lodash/src/utils/noop'

import { getNakedSingleRawHints } from './nakedSingle/nakedSingle'
import { getHiddenSingleRawHints } from './hiddenSingle/hiddenSingle'
import { getNakedGroupRawHints } from './nakedGroup/nakedGroup'
import { getHiddenGroupRawHints } from './hiddenGroup/hiddenGroup'
import { getXWingRawHints } from './xWing'
import { getYWingRawHints } from './yWing/yWing'
import { getOmissionRawHints } from './omission/omission'

import {
    transformNakedSingleRawHint,
    transformHiddenSingleRawHint,
    transformNakedGroupRawHint,
    transformHiddenGroupRawHint,
    transformXWingRawHint,
    transformYWingRawHint,
    transformOmissionRawHint,
} from './rawHintTransformers'

import { nakedSingleApplyHint } from './applyHint'

import { GROUPS, HINTS_IDS, UI_HINTS_COUNT_THRESHOLD } from './constants'

export const getRawHints = async (hintId, mainNumbers, notesData) => {
    const handler = HINT_ID_VS_HANDLERS[hintId]
    return handler(mainNumbers, notesData)
}

export const getTransformedRawHints = (hintId, rawHints, mainNumbers, notesData) => {
    if (_isEmpty(rawHints)) return null
    return {
        hints: _map(rawHints, rawHint => HINT_ID_VS_RAW_HINT_TRANSFORMERS[hintId]({ rawHint, mainNumbers, notesData })),
        // TODO: this just went inconsistent 
        applyHint: _map(rawHints, rawHint => HINT_IS_VS_APPLY_HINT_CHANGES_HANDLER[hintId]({ rawHint, mainNumbers, notesData }))[0]
    }
}

// TODO: fix the contract of this module. it returns null and receiving all
// sorts of things from it's dependent modules
const HINT_ID_VS_HANDLERS = {
    [HINTS_IDS.NAKED_SINGLE]: function (mainNumbers, notesData) {
        return getNakedSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.HIDDEN_SINGLE]: function (mainNumbers, notesData) {
        return getHiddenSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.NAKED_DOUBLE]: function (mainNumbers, notesData) {
        return HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](2, mainNumbers, notesData)
    },
    [HINTS_IDS.HIDDEN_DOUBLE]: function (mainNumbers, notesData) {
        return HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](2, mainNumbers, notesData)
    },
    [HINTS_IDS.NAKED_TRIPPLE]: function (mainNumbers, notesData) {
        return HINT_ID_VS_HANDLERS[GROUPS.NAKED_GROUP](3, mainNumbers, notesData)
    },
    [HINTS_IDS.HIDDEN_TRIPPLE]: function (mainNumbers, notesData) {
        return HINT_ID_VS_HANDLERS[GROUPS.HIDDEN_GROUP](3, mainNumbers, notesData)
    },
    [GROUPS.NAKED_GROUP]: function (candidatesCount, mainNumbers, notesData) {
        return getNakedGroupRawHints(candidatesCount, notesData, mainNumbers, UI_HINTS_COUNT_THRESHOLD)
    },
    [GROUPS.HIDDEN_GROUP]: function (candidatesCount, mainNumbers, notesData) {
        return getHiddenGroupRawHints(candidatesCount, notesData, mainNumbers, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.X_WING]: function (mainNumbers, notesData) {
        return getXWingRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.Y_WING]: function (mainNumbers, notesData) {
        return getYWingRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.OMISSION]: function (mainNumbers, notesData) {
        return getOmissionRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
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

const HINT_IS_VS_APPLY_HINT_CHANGES_HANDLER = {
    [HINTS_IDS.NAKED_SINGLE]: nakedSingleApplyHint,
    [HINTS_IDS.HIDDEN_SINGLE]: _noop,
    [HINTS_IDS.NAKED_DOUBLE]: _noop,
    [HINTS_IDS.NAKED_TRIPPLE]: _noop,
    [HINTS_IDS.HIDDEN_DOUBLE]: _noop,
    [HINTS_IDS.HIDDEN_TRIPPLE]: _noop,
    [HINTS_IDS.X_WING]: _noop,
    [HINTS_IDS.Y_WING]: _noop,
    [HINTS_IDS.OMISSION]: _noop,
}
