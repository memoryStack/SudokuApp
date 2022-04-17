import { getAllNakedSingles } from './smartHints/nakedSingle/nakedSingle'
import { getAllHiddenSingles } from './smartHints/hiddenSingle/hiddenSingle'
import { highlightNakedDoublesOrTriples } from './smartHints/nakedGroup'
import { highlightHiddenGroups } from './smartHints/hiddenGroup/hiddenGroup'
import { GROUPS, HINTS_IDS, INDEPENDENT_HINTS_MENU_ITEMS } from './smartHints/constants'
import { getXWingHints } from './smartHints/xWing'
import { getYWingsHints } from './smartHints/yWing/yWing'

const hintsHandlerMap = {
    [HINTS_IDS.NAKED_SINGLE]: function (mainNumbers, notesData) {
        return getAllNakedSingles(mainNumbers, notesData)
    },
    [HINTS_IDS.HIDDEN_SINGLE]: function (mainNumbers, notesData) {
        return getAllHiddenSingles(mainNumbers, notesData)
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
        const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
            candidatesCount,
            notesData,
            mainNumbers,
        )
        if (nakedGroupFound) return returnData
        return null
    },
    [GROUPS.HIDDEN_GROUP]: function (candidatesCount, mainNumbers, notesData) {
        const { present, returnData } = highlightHiddenGroups(candidatesCount, notesData, mainNumbers)
        if (present) return returnData
        return null
    },
    [HINTS_IDS.X_WING]: function (mainNumbers, notesData) {
        return getXWingHints(mainNumbers, notesData)
    },
    [HINTS_IDS.Y_WING]: function (mainNumbers, notesData) {
        const yWingsData = getYWingsHints(mainNumbers, notesData)
        if (!yWingsData || !yWingsData.length) return null
        return yWingsData
    },
    [HINTS_IDS.ALL]: function (mainNumbers, notesData) {
        const result = []
        INDEPENDENT_HINTS_MENU_ITEMS.forEach(({ id }) => {
            const hints = hintsHandlerMap[id](mainNumbers, notesData)
            if (hints) result.push(...hints)
        })
        return result.length ? result : null
    },
}

const getSmartHint = async (originalMainNumbers, notesData, requestedHintId) => {
    const handler = hintsHandlerMap[requestedHintId]
    if (handler) {
        return handler(originalMainNumbers, notesData)
    }
    throw 'invalid type of selective hint'
}

export { getSmartHint }
