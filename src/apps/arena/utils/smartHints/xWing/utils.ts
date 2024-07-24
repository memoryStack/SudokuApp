import _flatten from '@lodash/flatten'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { Houses } from '../../classes/houses'

import { getHouseCells } from '@domain/board/utils/housesAndCells'
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
import {
    FinnedLegCellsCategories,
    SashimiXWingPerfectLegCellsCategories, XWingLeg, XWingLegs, XWingRawHint,
} from './types'

export const isPerfectLegType = (leg: XWingLeg) => leg.type === LEG_TYPES.PERFECT

export const categorizeLegs = (legA: XWingLeg, legB: XWingLeg) => {
    const perfectLeg = isPerfectLegType(legA) ? legA : legB
    return {
        perfectLeg,
        otherLeg: perfectLeg === legA ? legB : legA,
    }
}

export const categorizeFinnedLegCells = (perfectLegHostCells: Cell[], finnedLegHostCells: Cell[]): FinnedLegCellsCategories => {
    const perfectCells = finnedLegHostCells.filter(finnedLegCell => perfectLegHostCells.some(perfectLegCell => {
        const cellsPair = [finnedLegCell, perfectLegCell]
        return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
    }))

    return {
        perfect: perfectCells,
        finns: finnedLegHostCells.filter(cell => !isCellExists(cell, perfectCells)),
    }
}

export const getCrossHouseType = (houseType: HouseType): HouseType => (Houses.isRowHouse(houseType) ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

export const getFinnedXWingRemovableNotesHostCells = ({ houseType, legs }: XWingRawHint, notesData: Notes): Cell[] => {
    const { perfectLeg, otherLeg } = categorizeLegs(legs[0], legs[1])
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

export const getPerfectCellsInFinnedBlock = (legs: XWingLegs) => {
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(legs[0], legs[1])
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    return perfectCells.filter(perfectCell => finns.some(finnCell => areSameBlockCells([finnCell, perfectCell])))
}

export const addCellInXWingLeg = (cell: Cell, legCells: Cell[], houseType: HouseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    legCells.push(cell)
    legCells.sort((cellA, cellB) => {
        if (Houses.isRowHouse(crossHouseType)) return cellA.row - cellB.row
        return cellA.col - cellB.col
    })
}

export const getXWingCandidate = (xWing: XWingRawHint) => xWing.legs[0].candidate

export const getXWingHosuesInOrder = (xWing: XWingRawHint) => xWing.legs.map(({ cells }) => getCellHouseForHouseType(xWing.houseType, cells[0]))

export const getXWingCells = (xWingLegs: XWingLegs): Cell[] => _flatten(xWingLegs.map(leg => leg.cells))

export const getSashimiCell = ({ houseType, legs }: XWingRawHint): Cell => {
    const { perfectLeg, otherLeg } = categorizeLegs(legs[0], legs[1])
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

export const categorizeSashimiXWingPerfectLegCells = (perfectLegCells: Cell[], otherLegCells: Cell[]): SashimiXWingPerfectLegCellsCategories => {
    const result = {} as SashimiXWingPerfectLegCellsCategories
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
