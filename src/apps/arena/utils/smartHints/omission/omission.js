import _isEmpty from '@lodash/isEmpty'

import { HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import {
    getCellsCommonHouses,
    isCellEmpty,
    isCellNoteVisible,
    areSameCellsSets,
    getCellHousesInfo,
    isCellExists,
} from '../../util'

import { maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { HINTS_IDS, HOUSE_TYPE } from '../constants'

const HOST_CELLS_COMMON_HOUSES_COUNT = 2

export const areValidOmissionHostCells = hostCells => {
    if (hostCells.length < 2) return false

    const cellsCommonHouses = Object.values(getCellsCommonHouses(hostCells)).filter(value => value)
    return cellsCommonHouses.length === HOST_CELLS_COMMON_HOUSES_COUNT
}

// TODO: change it's name to something more expressive intent
// TODO: this func is doing 2 things. transform it
// let's come back to this some time later and see if
// it should be made simple or not
export const isNoteHaveOmissionInHouse = (note, house, mainNumbers, notesData) => {
    const houseCells = getHouseCells(house)

    const hostCells = houseCells
        .filter(cell => isCellEmpty(cell, mainNumbers))
        .filter(cell => isCellNoteVisible(note, notesData[cell.row][cell.col]))

    const isValidOmission = isHintValid({ type: HINTS_IDS.OMISSION, data: { houseCells, note, userNotesHostCells: hostCells } })
        && areValidOmissionHostCells(hostCells)
    return {
        present: isValidOmission,
        hostCells,
    }
}

const getRemovableNotesHostHouse = (hostCells, hostHouse) => {
    const commonHouses = getCellsCommonHouses(hostCells)
    return getCellHousesInfo(hostCells[0]).filter(house => commonHouses[house.type] && house.type !== hostHouse.type)[0]
}

export const getHouseOmissions = (house, mainNumbers, notesData) => {
    const result = []
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const { present, hostCells } = isNoteHaveOmissionInHouse(note, house, mainNumbers, notesData)
        if (present) {
            result.push({
                hostHouse: house,
                removableNotesHostHouse: getRemovableNotesHostHouse(hostCells, house),
                note,
                hostCells,
            })
        }
    }

    return result
}

const isDuplicateOmission = (newOmission, allOmissions) => allOmissions.some(existingOmission => {
    const isSameNote = newOmission.note === existingOmission.note
    return isSameNote && areSameCellsSets(newOmission.hostCells, existingOmission.hostCells)
})

export const removesNotes = (omission, mainNumbers, notesData) => {
    const { removableNotesHostHouse } = omission
    const houseCells = getHouseCells(removableNotesHostHouse)

    return houseCells
        .filter(cell => isCellEmpty(cell, mainNumbers) && !isCellExists(cell, omission.hostCells))
        .some(cell => isCellNoteVisible(omission.note, notesData[cell.row][cell.col]))
}

export const getOmissionRawHints = (mainNumbers, notesData, maxHintsThreshold) => {
    const result = []

    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    allHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const house = { type: houseType, num: houseNum }
            const newOmissions = getHouseOmissions(house, mainNumbers, notesData).filter(newOmission => !isDuplicateOmission(newOmission, result) && removesNotes(newOmission, mainNumbers, notesData))
            result.push(...newOmissions)
        }
    })

    return result
}
