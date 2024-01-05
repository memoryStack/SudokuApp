import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'
import { HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import {
    getCellsCommonHouses,
    areSameCellsSets,
    getCellHousesInfo,
    isCellExists,
} from '../../util'

import { isSinglesPresentInCellForNote, maxHintsLimitReached } from '../util'
import { isHintValid } from '../validityTest'
import { HINTS_IDS, HOUSE_TYPE } from '../constants'

import { RawOmissionHint } from './types'
import { PuzzleSingles } from '../types'

const HOST_CELLS_COMMON_HOUSES_COUNT = 2

export const areValidOmissionHostCells = (note: NoteValue, hostCells: Cell[], singles: PuzzleSingles) => {
    if (hostCells.length < 2) return false

    const singleInAnyHostCell = hostCells.some(hostCell => isSinglesPresentInCellForNote(note, hostCell, singles))
    if (singleInAnyHostCell) return false

    const cellsCommonHouses = Object.values(getCellsCommonHouses(hostCells)).filter(value => value)
    return cellsCommonHouses.length === HOST_CELLS_COMMON_HOUSES_COUNT
}

export const analyzeOmissionInHouse = (
    note: NoteValue,
    house: House,
    mainNumbers: MainNumbers,
    notesData: Notes,
    possibleNotes: Notes,
    singles: PuzzleSingles,
) => {
    const houseCells = getHouseCells(house)

    const hostCells = houseCells
        .filter(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))
        .filter(cell => NotesRecord.isNotePresentInCell(notesData, note, cell))

    const isValidOmission = isHintValid({ type: HINTS_IDS.OMISSION, data: { houseCells, note, userNotesHostCells: hostCells } }, possibleNotes)
        && areValidOmissionHostCells(note, hostCells, singles)
    return {
        present: isValidOmission,
        hostCells,
    }
}

const getRemovableNotesHostHouse = (hostCells: Cell[], hostHouse: House): House => {
    const commonHouses = getCellsCommonHouses(hostCells)
    return getCellHousesInfo(hostCells[0]).filter(house => commonHouses[house.type] && house.type !== hostHouse.type)[0]
}

export const getHouseOmissions = (
    house: House,
    mainNumbers: MainNumbers,
    notesData: Notes,
    possibleNotes: Notes,
    singles: PuzzleSingles,
): RawOmissionHint[] => {
    const result = []
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        const { present, hostCells } = analyzeOmissionInHouse(note, house, mainNumbers, notesData, possibleNotes, singles)
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

const isDuplicateOmission = (newOmission: RawOmissionHint, allOmissions: RawOmissionHint[]) => allOmissions.some(existingOmission => {
    const isSameNote = newOmission.note === existingOmission.note
    return isSameNote && areSameCellsSets(newOmission.hostCells, existingOmission.hostCells)
})

export const removesNotes = (omission: RawOmissionHint, mainNumbers: MainNumbers, notesData: Notes) => {
    const { removableNotesHostHouse } = omission
    const houseCells = getHouseCells(removableNotesHostHouse)

    return houseCells
        .filter(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell) && !isCellExists(cell, omission.hostCells))
        .some(cell => NotesRecord.isNotePresentInCell(notesData, omission.note, cell))
}

export const getOmissionRawHints = (
    mainNumbers: MainNumbers,
    notesData: Notes,
    possibleNotes: Notes,
    singles: PuzzleSingles,
    maxHintsThreshold: number,
) => {
    const result: RawOmissionHint[] = []

    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    allHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const house = { type: houseType, num: houseNum }
            const newOmissions = getHouseOmissions(house, mainNumbers, notesData, possibleNotes, singles)
                .filter(newOmission => !isDuplicateOmission(newOmission, result)
                    && removesNotes(newOmission, mainNumbers, notesData))
            result.push(...newOmissions)
        }
    })

    return result
}
