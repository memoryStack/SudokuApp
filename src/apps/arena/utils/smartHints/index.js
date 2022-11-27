import _isEmpty from 'lodash/src/utils/isEmpty'
import _map from 'lodash/src/utils/map'

import { getNakedSingleRawHints } from './nakedSingle/nakedSingle'
import { getHiddenSingleRawHints } from './hiddenSingle/hiddenSingle'
import { getNakedGroupRawHints } from './nakedGroup/nakedGroup'
import { getHiddenGroupRawHints } from './hiddenGroup/hiddenGroup'
import { getXWingRawHints } from './xWing'
import { getYWingRawHints } from './yWing/yWing'
import { getOmissionRawHints } from './omission/omission'

import { getNakedSingleTechniqueToFocus } from './nakedSingle/uiHighlightData'
import { getHiddenSingleTechniqueInfo } from './hiddenSingle/uiHighlightData'
import { getUIHighlightData as getNakedGroupUIHighlightData } from './nakedGroup/uiHighlightData'
import { getGroupUIHighlightData as getHiddenGroupUIHighlightData } from './hiddenGroup/uiHighlightData'
import { getUIHighlightData as getXWingUIHighlightData } from './xWing/uiHighlightData'
import { getYWingHintUIHighlightData } from './yWing/uiHighlightData'
import { getUIHighlightData as getOmissionUIHighlightData } from './omission/uiHighlightData'

import {
    GROUPS,
    HINTS_IDS,
    INDEPENDENT_HINTS_MENU_ITEMS,
    UI_HINTS_COUNT_THRESHOLD,
} from './constants'

export const getSmartHint = async (mainNumbers, notesData, requestedHintId) => {
    const handler = hintsHandlerMap[requestedHintId]
    if (handler) {
        const rawHints = handler(mainNumbers, notesData)
        if (_isEmpty(rawHints)) return null

        return _map(rawHints, rawHint => hintUIHighlightDataMap[requestedHintId]({ rawHint, mainNumbers, notesData }))
    }
    throw 'invalid type of selective hint'
}

// TODO: fix the contract of this module. it returns null and receiving all
// sorts of things from it's dependent modules
const hintsHandlerMap = {
    [HINTS_IDS.NAKED_SINGLE]: function (mainNumbers, notesData) {
        return getNakedSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.HIDDEN_SINGLE]: function (mainNumbers, notesData) {
        return getHiddenSingleRawHints(mainNumbers, notesData, UI_HINTS_COUNT_THRESHOLD)
    },
    [HINTS_IDS.NAKED_DOUBLE]: function (mainNumbers, notesData) {
        return hintsHandlerMap[GROUPS.NAKED_GROUP](2, mainNumbers, notesData)
    },
    [HINTS_IDS.HIDDEN_DOUBLE]: function (mainNumbers, notesData) {
        return hintsHandlerMap[GROUPS.HIDDEN_GROUP](2, mainNumbers, notesData)
    },
    [HINTS_IDS.NAKED_TRIPPLE]: function (mainNumbers, notesData) {
        return hintsHandlerMap[GROUPS.NAKED_GROUP](3, mainNumbers, notesData)
    },
    [HINTS_IDS.HIDDEN_TRIPPLE]: function (mainNumbers, notesData) {
        return hintsHandlerMap[GROUPS.HIDDEN_GROUP](3, mainNumbers, notesData)
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
    // TODO: will remove it in near future
    [HINTS_IDS.ALL]: function (mainNumbers, notesData) {
        const result = []
        INDEPENDENT_HINTS_MENU_ITEMS.forEach(({ id }) => {
            const hints = hintsHandlerMap[id](mainNumbers, notesData)
            if (hints) result.push(...hints)
        })
        return result.length ? result : null
    },
}

const hintUIHighlightDataMap = {
    [HINTS_IDS.NAKED_SINGLE]: getNakedSingleTechniqueToFocus,
    [HINTS_IDS.HIDDEN_SINGLE]: getHiddenSingleTechniqueInfo,
    [HINTS_IDS.NAKED_DOUBLE]: getNakedGroupUIHighlightData,
    [HINTS_IDS.NAKED_TRIPPLE]: getNakedGroupUIHighlightData,
    [HINTS_IDS.HIDDEN_DOUBLE]: getHiddenGroupUIHighlightData,
    [HINTS_IDS.HIDDEN_TRIPPLE]: getHiddenGroupUIHighlightData,
    [HINTS_IDS.X_WING]: getXWingUIHighlightData,
    [HINTS_IDS.Y_WING]: getYWingHintUIHighlightData,
    [HINTS_IDS.OMISSION]: getOmissionUIHighlightData,
}
