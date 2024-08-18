import _isEmpty from '@lodash/isEmpty'
import _map from '@lodash/map'
import _noop from '@lodash/noop'

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
    transformXYChainRawHint,
    transformEmptyRectangleRawHint,
    transformWWingRawHint,
    transformXYZWingRawHint,
    transformURRawHint
} from './rawHintTransformers'

import { HINTS_IDS } from './constants'

export const getTransformedRawHints = (hintId, rawHints, mainNumbers, notesData, smartHintsColorSystem) => {
    if (_isEmpty(rawHints)) return null
    return _map(rawHints, rawHint => HINT_ID_VS_RAW_HINT_TRANSFORMERS[hintId]({
        rawHint, mainNumbers, notesData, smartHintsColorSystem,
    }))
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
    [HINTS_IDS.XY_CHAIN]: transformXYChainRawHint,
    [HINTS_IDS.EMPTY_RECTANGLE]: transformEmptyRectangleRawHint,
    [HINTS_IDS.W_WING]: transformWWingRawHint,
    [HINTS_IDS.XYZ_WING]: transformXYZWingRawHint,
    [HINTS_IDS.UNIQUE_RECTANGLE]: transformURRawHint
}
