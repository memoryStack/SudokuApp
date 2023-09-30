import _isNil from '@lodash/isNil'
import _isEmpty from '@lodash/isEmpty'
import _map from '@lodash/map'
import _at from '@lodash/at'
import _cloneDeep from '@lodash/cloneDeep'

// TODO: add aliases for these files
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { N_CHOOSE_K } from '@resources/constants'
import { BoardIterators } from '../../classes/boardIterators'

export const getNoteHostCellsInHouse = (note, house, notes) => {
    const result = []
    BoardIterators.forHouseEachCell(house, cell => {
        if (NotesRecord.isNotePresentInCell(notes, note, cell)) {
            result.push(cell)
        }
    })
    return result
}

// TODO: this will be a general util for all the Chains
export const getCandidateAllStrongLinks = (note, notes, possibleNotes) => {
    const result = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (isValidStrongLink) {
            // TODO: use lodash util here
            if (!result[house.type]) result[house.type] = {}
            result[house.type][house.num] = noteUserFilledHostCells
        }
    })

    return result
}

const getWeakLinkPairs = hostCells => {
    const combinations = N_CHOOSE_K[hostCells.length][2]
    // TODO: add lodash util for reverse
    return _map(combinations, combination => _at(hostCells, _cloneDeep(combination).reverse()))
}

export const getNoteWeakLinks = (note, notes, possibleNotes) => {
    const result = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (!isValidStrongLink && noteUserFilledHostCells.length > 1) {
            // TODO: use lodash util here
            if (!result[house.type]) result[house.type] = {}

            const weakLinksGroups = getWeakLinkPairs(noteUserFilledHostCells)
            if (!_isEmpty(weakLinksGroups)) result[house.type][house.num] = weakLinksGroups
        }
    })

    return result
}

export const getAllStrongLinks = (notes, possibleNotes) => {
    const result = {}

    BoardIterators.forCellEachNote(note => {
        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        if (!_isEmpty(strongLinks)) {
            result[note] = strongLinks
        }
    })

    return result
}

export const getXChainRawHints = (mainNumbers, notes) => {
    const rawHintData = null // getHintRawData(notesPairsHostCells, notes)
    return _isNil(rawHintData) ? null : [rawHintData]
}
