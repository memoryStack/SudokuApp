import { LEG_TYPES } from "./constants"
import { areSameColCells, areSameRowCells, isCellExists } from '../../util'
import { HOUSE_TYPE } from "../constants"
import { getHouseCells } from "../../houseCells"
import { getBlockAndBoxNum } from "../../../../../utils/util"

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

export const getFinnedXWingRemovableNotesHostCells = ({ houseType, legs }) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, otherLeg.cells)
    const crossHouseType = getCrossHouseType(houseType)

    const xWingBaseCells = [...otherLeg.cells, ...perfectLeg.cells]
    return getHouseCells(HOUSE_TYPE.BLOCK, getBlockAndBoxNum(finns[0]).blockNum)
    .filter((cell) => {
        if ( isCellExists(cell, xWingBaseCells) ) return false
        return perfectCells.some(perfectCell => {
            const cellsPair = [cell, perfectCell]
            if (crossHouseType === HOUSE_TYPE.ROW) return areSameRowCells(cellsPair)
            return areSameColCells(cellsPair)
        })
    })
}
