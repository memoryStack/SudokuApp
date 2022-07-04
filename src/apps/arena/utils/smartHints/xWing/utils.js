import { LEG_TYPES } from './constants'
import {
    areSameColCells,
    areSameRowCells,
    getCellHouseInfo,
    getHouseAxesValue,
    isCellExists,
    isCellNoteVisible,
} from '../../util'
import { HOUSE_TYPE } from '../constants'
import { getHouseCells } from '../../houseCells'
import { consoleLog, getBlockAndBoxNum } from '../../../../../utils/util'
import { toOrdinal } from '../../../../../utils/utilities/toOrdinal'
import { getCellsAxesValuesListText } from '../tryOutInputAnalyser/helpers'

export const categorizeLegs = (legA, legB) => {
    const perfectLeg = legA.type === LEG_TYPES.PERFECT ? legA : legB
    const otherLeg = perfectLeg === legA ? legB : legA

    return {
        perfectLeg,
        otherLeg,
    }
}

export const categorizeFinnedLegCells = (perfectLegHostCells, finnedLegHostCells) => {
    const perfectCells = finnedLegHostCells.filter(finnedLegCell => {
        return perfectLegHostCells.some(perfectLegCell => {
            const cellsPair = [finnedLegCell, perfectLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
    })

    const finnCells = finnedLegHostCells.filter(cell => !isCellExists(cell, perfectCells))

    return {
        perfect: perfectCells,
        finns: finnCells,
    }
}

export const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

export const getFinnedXWingRemovableNotesHostCells = ({ houseType, legs }, notesData) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, otherLeg.cells)
    const crossHouseType = getCrossHouseType(houseType)
    const candidate = perfectLeg.candidate
    const xWingBaseCells = [...otherLeg.cells, ...perfectLeg.cells]
    return getHouseCells(HOUSE_TYPE.BLOCK, getBlockAndBoxNum(finns[0]).blockNum).filter(cell => {
        if (isCellExists(cell, xWingBaseCells) || !isCellNoteVisible(candidate, notesData[cell.row][cell.col]))
            return false
        return perfectCells.some(perfectCell => {
            const cellsPair = [cell, perfectCell]
            if (crossHouseType === HOUSE_TYPE.ROW) return areSameRowCells(cellsPair)
            return areSameColCells(cellsPair)
        })
    })
}

export const getPerfectCellsInFinnedBlock = legs => {
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    return perfectCells.filter(perfectCell => {
        return finns.some(finnCell => {
            return getBlockAndBoxNum(finnCell).blockNum === getBlockAndBoxNum(perfectCell).blockNum
        })
    })
}

export const addCellInXWingLeg = (cell, legCells, houseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    legCells.push(cell)
    legCells.sort((cellA, cellB) => {
        return cellA[crossHouseType] - cellB[crossHouseType]
    })
}

export const getXWingCandidate = xWing => {
    return xWing.legs[0].candidate
}

export const getXWingHosuesInOrder = xWing => {
    return xWing.legs.map(({ cells }) => {
        return getCellHouseInfo(xWing.houseType, cells[0])
    })
}

/* hint text helpers */

export const getXWingHousesTexts = (houseType, xWingLegs) => {
    const { houseANum, houseBNum } = getXWingHousesNums(houseType, xWingLegs)
    return {
        houseAAxesValue: getHouseAxesText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseAxesText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType, xWingLegs) => {
    return {
        houseANum: getCellHouseInfo(houseType, xWingLegs[0].cells[0]).num,
        houseBNum: getCellHouseInfo(houseType, xWingLegs[1].cells[0]).num,
    }
}

export const getHouseAxesText = house => {
    const houseAxesValue = getHouseAxesValue(house)
    if (house.type === HOUSE_TYPE.ROW) return houseAxesValue
    return toOrdinal(parseInt(houseAxesValue), 10)
}

export const getCrossHouseAxesText = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const { crossHouseANum, crossHouseBNum } = getCrossHousesNums(xWing)
    return {
        crossHouseAAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseANum }),
        crossHouseBAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseBNum }),
    }
}

const getCrossHousesNums = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    return {
        crossHouseANum: getCellHouseInfo(crossHouseType, xWing.legs[0].cells[0]).num,
        crossHouseBNum: getCellHouseInfo(crossHouseType, xWing.legs[0].cells[1]).num,
    }
}

export const getXWingRectangleCornersAxesText = xWingLegs => {
    const cornersList = [...xWingLegs[0].cells, xWingLegs[1].cells[1], xWingLegs[1].cells[0]]
    cornersList.push(cornersList[0])
    return getCellsAxesValuesListText(cornersList)
}

export const getDiagonalsCornersAxesTexts = xWing => {
    const { topLeft, topRight, bottomLeft, bottomRight } = getXWingCornerCells(xWing)
    return {
        topDown: getCellsAxesValuesListText([topLeft, bottomRight]),
        bottomUp: getCellsAxesValuesListText([bottomLeft, topRight]),
    }
}

const getXWingCornerCells = xWing => {
    const houseType = xWing.houseType
    const xWingLegs = xWing.legs
    return {
        topLeft: xWingLegs[0].cells[0],
        topRight: houseType === HOUSE_TYPE.COL ? xWingLegs[1].cells[0] : xWingLegs[0].cells[1],
        bottomLeft: houseType === HOUSE_TYPE.COL ? xWingLegs[0].cells[1] : xWingLegs[1].cells[0],
        bottomRight: xWingLegs[1].cells[1],
    }
}
