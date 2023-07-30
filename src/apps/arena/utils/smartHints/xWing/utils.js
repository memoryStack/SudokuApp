import _flatten from '@lodash/flatten'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { Houses } from '../../classes/houses'

import { getHouseCells } from '../../houseCells'
import {
    areSameColCells,
    areSameRowCells,
    getCellHouseForHouseType,
    isCellExists,
    getCellBlockHouseInfo,
    areSameBlockCells,
} from '../../util'

import { HOUSE_TYPE } from '../constants'

import { LEG_TYPES } from './constants'

export const isPerfectLegType = leg => leg.type === LEG_TYPES.PERFECT

export const categorizeLegs = (legA, legB) => {
    const perfectLeg = isPerfectLegType(legA) ? legA : legB
    return {
        perfectLeg,
        otherLeg: perfectLeg === legA ? legB : legA,
    }
}

export const categorizeFinnedLegCells = (perfectLegHostCells, finnedLegHostCells) => {
    const perfectCells = finnedLegHostCells.filter(finnedLegCell => perfectLegHostCells.some(perfectLegCell => {
        const cellsPair = [finnedLegCell, perfectLegCell]
        return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
    }))

    return {
        perfect: perfectCells,
        finns: finnedLegHostCells.filter(cell => !isCellExists(cell, perfectCells)),
    }
}

export const getCrossHouseType = houseType => (Houses.isRowHouse(houseType) ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

export const getFinnedXWingRemovableNotesHostCells = ({ houseType, legs }, notesData) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { perfect: finnedLegPerfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, otherLeg.cells)

    return getHouseCells(getCellBlockHouseInfo(finns[0])).filter(cell => {
        if (
            isCellExists(cell, getXWingCells(legs))
            || !NotesRecord.isNotePresentInCell(notesData, perfectLeg.candidate, cell)
        ) return false
        return finnedLegPerfectCells.some(perfectCell => {
            const cellsPair = [cell, perfectCell]
            if (Houses.isRowHouse(getCrossHouseType(houseType))) return areSameRowCells(cellsPair)
            return areSameColCells(cellsPair)
        })
    })
}

export const getPerfectCellsInFinnedBlock = legs => {
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    return perfectCells.filter(perfectCell => finns.some(finnCell => areSameBlockCells([finnCell, perfectCell])))
}

export const addCellInXWingLeg = (cell, legCells, houseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    legCells.push(cell)
    legCells.sort((cellA, cellB) => cellA[crossHouseType] - cellB[crossHouseType])
}

export const getXWingCandidate = xWing => xWing.legs[0].candidate

export const getXWingHosuesInOrder = xWing => xWing.legs.map(({ cells }) => getCellHouseForHouseType(xWing.houseType, cells[0]))

export const getXWingCells = xWingLegs => _flatten(xWingLegs.map(leg => leg.cells))

export const getSashimiCell = ({ houseType, legs }) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { sashimiAligned } = categorizeSashimiXWingPerfectLegCells(perfectLeg.cells, otherLeg.cells)

    if (Houses.isRowHouse(houseType)) {
        return {
            row: otherLeg.cells[0].row,
            col: sashimiAligned.col,
        }
    }

    return {
        row: sashimiAligned.row,
        col: otherLeg.cells[0].col,
    }
}

export const categorizeSashimiXWingPerfectLegCells = (perfectLegCells, otherLegCells) => {
    const result = {}
    perfectLegCells.forEach(perfectLegCell => {
        // TODO: this below loop is repeating again and again
        // extract it
        const isAligned = otherLegCells.some(otherLegCell => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
        if (isAligned) result.perfectAligned = perfectLegCell
        else result.sashimiAligned = perfectLegCell
    })
    return result
}
