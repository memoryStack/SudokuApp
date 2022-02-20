import { getAllNakedSingles } from './smartHints/nakedSingle/nakedSingle'
import { getAllHiddenSingles } from './smartHints/hiddenSingle/hiddenSingle'
import { highlightNakedDoublesOrTriples } from './smartHints/nakedGroup'
import { highlightHiddenGroups } from './smartHints/hiddenGroup/hiddenGroup'

// TODO: move it
export const HOUSE_TYPE = {
    ROW: 'row',
    COL: 'col',
    BLOCK: 'block',
}

// TODO: change the below to support selective hints as well
const hintsHandlerMap = {
    0: function (mainNumbers, notesData) {
        return getAllNakedSingles(mainNumbers, notesData)
    },
    1: function (mainNumbers, notesData) {
        return getAllHiddenSingles(mainNumbers, notesData)
    },
    2: function (mainNumbers, notesData) {
        return hintsHandlerMap['NAKED_GROUP'](2, mainNumbers, notesData)
    },
    3: function (mainNumbers, notesData) {
        return hintsHandlerMap['HIDDEN_GROUP'](2, mainNumbers, notesData)
    },
    4: function (mainNumbers, notesData) {
        return hintsHandlerMap['NAKED_GROUP'](3, mainNumbers, notesData)
    },
    5: function (mainNumbers, notesData) {
        return hintsHandlerMap['HIDDEN_GROUP'](3, mainNumbers, notesData)
    },
    NAKED_GROUP: function (candidatesCount, mainNumbers, notesData) {
        const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
            candidatesCount,
            notesData,
            mainNumbers,
        )
        if (nakedGroupFound) return returnData
        return null
    },
    HIDDEN_GROUP: function (candidatesCount, mainNumbers, notesData) {
        const { present, returnData } = highlightHiddenGroups(candidatesCount, notesData, mainNumbers)
        if (present) return returnData
        return null
    },
    '-1': function (mainNumbers, notesData) {
        const result = []
        const nakedSingles = hintsHandlerMap['0'](mainNumbers, notesData)
        if (nakedSingles) result.push(...nakedSingles)

        const hiddenSingles = hintsHandlerMap['1'](mainNumbers, notesData)
        if (hiddenSingles) result.push(...hiddenSingles)

        const nakedDoubles = hintsHandlerMap['2'](mainNumbers, notesData)
        if (nakedDoubles) result.push(...nakedDoubles)

        const hiddenDoubles = hintsHandlerMap['3'](mainNumbers, notesData)
        if (hiddenDoubles) result.push(...hiddenDoubles)

        const nakedTripples = hintsHandlerMap['4'](mainNumbers, notesData)
        if (nakedTripples) result.push(...nakedTripples)

        const hiddenTripples = hintsHandlerMap['5'](mainNumbers, notesData)
        if (hiddenTripples) result.push(...hiddenTripples)

        return result
    },
}

const getSmartHint = async (originalMainNumbers, notesData, hintCode) => {
    const handler = hintsHandlerMap[hintCode]
    if (handler) {
        return handler(originalMainNumbers, notesData)
    }
    throw 'invalid type of selective hint'
}

// Below is the older hints generator func
// write this in JS and if performance is not good then shift to native side
// const getSmartHint = async (originalMainNumbers, notesData) => {
//     // why are we copying it ?? is it getting modified somewhere ??
//     // TODO: write a test case for it, so that it doesn't modifiy the inputs at all

//     const nakedSinglesData = getAllNakedSingles(originalMainNumbers, notesData)
//     if (nakedSinglesData.length) {
//         return nakedSinglesData.map(({ cell, type }) => {
//             return getNakedSingleTechniqueToFocus(type, originalMainNumbers, cell)
//         })
//     }

//     const hiddenSinglesData = getAllHiddenSingles(originalMainNumbers, notesData)
//     if (hiddenSinglesData.length) {
//         return hiddenSinglesData.map(({ cell, type }) => {
//             return getHiddenSingleTechniqueInfo(cell, type, originalMainNumbers)
//         })
//     }

//     const possibleGroupCandidatesCount = [2, 3]
//     for (let i = 0; i < possibleGroupCandidatesCount.length; i++) {
//         const groupCandidatesCount = possibleGroupCandidatesCount[i]
//         const { present: nakedGroupFound, returnData } = highlightNakedDoublesOrTriples(
//             groupCandidatesCount,
//             notesData,
//             originalMainNumbers,
//         )
//         if (nakedGroupFound) return returnData
//     }

//     for (let i = 0; i < possibleGroupCandidatesCount.length; i++) {
//         const groupCandidatesCount = possibleGroupCandidatesCount[i]
//         const { present, returnData } = highlightHiddenGroups(groupCandidatesCount, notesData, originalMainNumbers)
//         if (present) return returnData
//     }

//     return null
// }

export { getSmartHint }
