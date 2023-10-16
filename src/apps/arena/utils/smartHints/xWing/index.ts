import _cloneDeep from '@lodash/cloneDeep'
import _get from '@lodash/get'
import _every from '@lodash/every'
import _some from '@lodash/some'
import _inRange from '@lodash/inRange'
import _isEmpty from '@lodash/isEmpty'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { MainNumbersRecord } from '../../../RecordUtilities/boardMainNumbers'

import { NUMBERS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import {
    areSameBlockCells,
    areSameColCells,
    areSameRowCells,
} from '../../util'

import { HINTS_IDS, HOUSE_TYPE } from '../constants'
import { isHintValid } from '../validityTest'

import {
    CANDIDATE_MAX_OCCURENCES_IN_FINNED_LEG,
    CANDIDATE_MIN_OCCURENCES_IN_FINNED_LEG,
    FINNED_LEG_MAX_HOST_BLOCKS_COUNT,
    LEG_TYPES,
    XWING_TYPES,
} from './constants'
import {
    getCrossHouseType,
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    addCellInXWingLeg,
    categorizeSashimiXWingPerfectLegCells,
    getSashimiCell,
    getXWingCandidate,
    isPerfectLegType,
} from './utils'
import { maxHintsLimitReached } from '../util'
import { Houses } from '../../classes/houses'
import { BoardIterators } from '../../classes/boardIterators'
import { getBlockAndBoxNum } from '../../cellTransformers'
import { XWingLeg, XWingLegs, XWingRawHint } from './types'

type NotesXWingLegs = {
    [note: NoteValue]: {
        [houseType: HouseType]: XWingLeg[]
    }
}

// TODO: at some places, we are passing potential XWings with houseType and legs and thse don't have
// XWing type. make a new type for these to explicitly communicate this. else in future it will lead to bugs

const getCrossHouseCells = (cell: Cell, houseType: HouseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    const crossHouseNum = Houses.isRowHouse(crossHouseType) ? cell.row : cell.col
    return getHouseCells({
        type: crossHouseType,
        num: crossHouseNum,
    })
}

const isPerfectXWingRemovesNotes = (xWing: XWingRawHint, notesData: Notes) => {
    const MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVER_XWING = 3

    return xWing.legs[0].cells.some(mainHouseCell => {
        const candidate = getXWingCandidate(xWing)
        let candidateInstancesCount = 0
        getCrossHouseCells(mainHouseCell, xWing.houseType).forEach(cell => {
            if (NotesRecord.isNotePresentInCell(notesData, candidate, cell)) candidateInstancesCount++
        })
        return candidateInstancesCount >= MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVER_XWING
    })
}

export const isFinnedXWingRemovesNotes = (xWing: XWingRawHint, notesData: Notes) => getFinnedXWingRemovableNotesHostCells(xWing, notesData)
    .some(cell => NotesRecord.isNotePresentInCell(notesData, xWing.legs[0].candidate, cell))

const removableNotesPresentInCrossHouse = (xWing: XWingRawHint, notesData: Notes) => {
    const { otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])

    if (otherLeg.type === LEG_TYPES.PERFECT) return isPerfectXWingRemovesNotes(xWing, notesData)
    return isFinnedXWingRemovesNotes(xWing, notesData)
}

// change it's name to perfectXWingLegs
export const isPerfectXWing = (perfectLegHostCells: Cell[], otherLegHostCells: Cell[]) => perfectLegHostCells.every(perfectLegCell => otherLegHostCells.some(otherLegCell => {
    const cellsPair = [perfectLegCell, otherLegCell]
    return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
}))

export const isFinnedXWing = (perfectLegHostCells: Cell[], finnedLegHostCells: Cell[]) => {
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLegHostCells, finnedLegHostCells)
    if (perfectCells.length !== 2) return false
    return finns.every(finnCell => perfectCells.some(perfectCell => areSameBlockCells([perfectCell, finnCell])))
}

const arePerfectNonAlignedLegsSashimiFinnedXWing = (xWing: XWingRawHint) => {
    const { perfectLeg, otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])
    return (
        isSashimiFinnedXWing({
            ...xWing,
            houseType: xWing.houseType,
            legs: [perfectLeg, { ...({ ...otherLeg }), type: LEG_TYPES.FINNED }],
        })
        || isSashimiFinnedXWing({
            ...xWing,
            houseType: xWing.houseType,
            legs: [otherLeg, { ...({ ...perfectLeg }), type: LEG_TYPES.FINNED }],
        })
    )
}

const allFinnsShareBlockWithSashimiCell = (
    sashimiCell: Cell,
    legsCells: { perfectLegCells: Cell[], sashimiFinnedLegCells: Cell[] },
) => {
    const { perfectLegCells, sashimiFinnedLegCells } = legsCells
    const { finns } = categorizeFinnedLegCells(perfectLegCells, sashimiFinnedLegCells)
    return finns.every(finn => areSameBlockCells([sashimiCell, finn]))
}

const perfectLegAlignsWithFinnedLegForSashimiXWing = (perfectLegCells: Cell[], finnedLegCells: Cell[]): boolean => {
    const { perfectAligned, sashimiAligned } = categorizeSashimiXWingPerfectLegCells(perfectLegCells, finnedLegCells)
    return !_isEmpty(perfectAligned) && !_isEmpty(sashimiAligned)
}

const isValidSashimiXWingAfterAddingSashimiCell = (xWing: XWingRawHint) => {
    const { perfectLeg, otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])
    const sashimiCell = getSashimiCell(xWing)
    const sashimiFinnedLegCells = [...otherLeg.cells]
    addCellInXWingLeg(sashimiCell, sashimiFinnedLegCells, xWing.houseType)

    if (isFinnedLeg(sashimiFinnedLegCells)) {
        return allFinnsShareBlockWithSashimiCell(sashimiCell, {
            perfectLegCells: perfectLeg.cells,
            sashimiFinnedLegCells,
        })
    }

    return false
}

export const isSashimiFinnedXWing = (xWing: XWingRawHint): boolean => {
    const { perfectLeg, otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])
    if (isPerfectLegType(otherLeg)) return arePerfectNonAlignedLegsSashimiFinnedXWing(xWing)
    if (!perfectLegAlignsWithFinnedLegForSashimiXWing(perfectLeg.cells, otherLeg.cells)) return false
    return isValidSashimiXWingAfterAddingSashimiCell(xWing)
}

const noLegIsPerfect = (xWing: XWingRawHint): boolean => _every(xWing.legs, (leg: XWingLeg) => !isPerfectLegType(leg))

export const getXWingType = (xWing: XWingRawHint) => {
    if (noLegIsPerfect(xWing)) return XWING_TYPES.INVALID

    const candidateAllNotesNotFilledInLegs = !isHintValid({ type: HINTS_IDS.X_WING, data: xWing })
    if (candidateAllNotesNotFilledInLegs) return XWING_TYPES.INVALID

    const { perfectLeg, otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])
    if (isPerfectLegType(otherLeg) && isPerfectXWing(perfectLeg.cells, otherLeg.cells)) return XWING_TYPES.PERFECT
    if (otherLeg.type === LEG_TYPES.FINNED && isFinnedXWing(perfectLeg.cells, otherLeg.cells)) return XWING_TYPES.FINNED
    if (isSashimiFinnedXWing(xWing)) return XWING_TYPES.SASHIMI_FINNED

    return XWING_TYPES.INVALID
}

const getEmptyCellsInHouse = (house: House, mainNumbers: MainNumbers) => getHouseCells(house).filter(cell => !MainNumbersRecord.isCellFilled(mainNumbers, cell))

// we can use this func for our purpose below
const getAllCandidatesOccurencesInHouse = (house: House, notesData: Notes, mainNumbers: MainNumbers) => {
    const result: { [note: NoteValue]: Cell[] } = {}
    getEmptyCellsInHouse(house, mainNumbers).forEach(cell => {
        NotesRecord.getCellVisibleNotesList(notesData, cell)
            .forEach(note => {
                if (!result[note]) result[note] = []
                result[note].push(cell)
            })
    })
    return result
}

const getHostCellsGroupByBlock = (hostCells: Cell[]) => {
    const result: { [blockNum: number]: Cell[] } = {}
    hostCells.forEach(cell => {
        const { blockNum } = getBlockAndBoxNum(cell)
        if (!result[blockNum]) result[blockNum] = []
        result[blockNum].push(cell)
    })
    return result
}

export const isFinnedLeg = (hostCells: Cell[]) => {
    const candidateOccurencesInValidRange = _inRange(hostCells.length, {
        start: CANDIDATE_MIN_OCCURENCES_IN_FINNED_LEG,
        end: CANDIDATE_MAX_OCCURENCES_IN_FINNED_LEG,
    })
    if (!candidateOccurencesInValidRange) return false

    const hostCellsGroupsByBlock = getHostCellsGroupByBlock(hostCells)
    const uniqueHostBlocksCount = Object.keys(hostCellsGroupsByBlock).length

    if (uniqueHostBlocksCount > FINNED_LEG_MAX_HOST_BLOCKS_COUNT) return false

    if (uniqueHostBlocksCount === 1 || hostCells.length === 3) return true

    return _some(Object.keys(hostCellsGroupsByBlock), (blockNum: number) => hostCellsGroupsByBlock[blockNum].length === 1)
}

const getXWingLegType = (candidateHostCells: Cell[]) => {
    if (candidateHostCells.length === 2) return LEG_TYPES.PERFECT
    if (isFinnedLeg(candidateHostCells)) return LEG_TYPES.FINNED
    return LEG_TYPES.INVALID
}

export const getHouseXWingLegs = (house: House, mainNumbers: MainNumbers, notesData: Notes) => {
    const result: XWingLeg[] = []

    const candidatesHostCells = getAllCandidatesOccurencesInHouse(house, notesData, mainNumbers)
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        if (!candidatesHostCells[note]) continue
        const legType = getXWingLegType(candidatesHostCells[note])
        if ([LEG_TYPES.PERFECT, LEG_TYPES.FINNED].includes(legType)) {
            result.push({ candidate: note, cells: candidatesHostCells[note], type: legType })
        }
    }

    return result
}

const getSashimiLegFromNonAllignedPerfectLegs = (xWing: XWingRawHint) => {
    const {
        legs: [legA, legB],
    } = xWing

    const isLegAValidSashimiLeg = isSashimiFinnedXWing({
        ...xWing,
        legs: [{ ...({ ...legA }), type: LEG_TYPES.FINNED }, legB],
    })
    return isLegAValidSashimiLeg ? legA : legB
}

const getValidSashimiXWingSashimiLeg = (xWing: XWingRawHint) => {
    const { otherLeg } = categorizeLegs(xWing.legs[0], xWing.legs[1])
    if (!isPerfectLegType(otherLeg)) return otherLeg

    return getSashimiLegFromNonAllignedPerfectLegs(xWing)
}

export const transformSashimiXWingLeg = (xWing: XWingRawHint): XWingLegs => {
    const { houseType, legs } = xWing
    const firstLeg = _cloneDeep(legs[0])
    const secondLeg = _cloneDeep(legs[1])

    const sashimiLeg = getValidSashimiXWingSashimiLeg({ ...xWing, legs: [firstLeg, secondLeg] })
    sashimiLeg.type = LEG_TYPES.SASHIMI_FINNED

    const { perfectLeg, otherLeg } = categorizeLegs(firstLeg, secondLeg)
    addCellInXWingLeg(getSashimiCell({ ...xWing, legs: [perfectLeg, otherLeg] }), sashimiLeg.cells, houseType)

    return [firstLeg, secondLeg]
}

const addCandidateXWingLeg = ({ candidate, cells, type: legType }: XWingLeg, houseType: HouseType, candidateXWingLegs: NotesXWingLegs) => {
    if (!candidateXWingLegs[candidate]) candidateXWingLegs[candidate] = {}
    if (!candidateXWingLegs[candidate][houseType]) candidateXWingLegs[candidate][houseType] = []
    candidateXWingLegs[candidate][houseType].push({ candidate, cells, type: legType }) // TODO: we don't need to add candidate here
}

const getAllXWingEligibleCandidates = (mainNumbers: MainNumbers, notesData: Notes) => {
    const result: NotesXWingLegs = {}

    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]
    searchableHouses.forEach(houseType => {
        BoardIterators.forEachHouseNum(houseNum => {
            const house = { type: houseType, num: houseNum }
            getHouseXWingLegs(house, mainNumbers, notesData).forEach(xWingLeg => {
                addCandidateXWingLeg(xWingLeg, houseType, result)
            })
        })
    })
    return result
}

const transformValidXWingLegs = (xWing: XWingRawHint): XWingLegs => (xWing.type === XWING_TYPES.SASHIMI_FINNED ? transformSashimiXWingLeg(xWing) : xWing.legs)

const getCandidateValidXWings = (
    houseType: HouseType,
    candidateXWingLegsInHouses: XWingLeg[],
    notes: Notes,
    maxHintsThreshold: number,
) => {
    const result: XWingRawHint[] = []
    for (let i = 0; i < candidateXWingLegsInHouses.length; i++) {
        for (let j = i + 1; j < candidateXWingLegsInHouses.length; j++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const firstLeg = candidateXWingLegsInHouses[i]
            const secondLeg = candidateXWingLegsInHouses[j]

            const xWingType = getXWingType({
                houseType,
                legs: [firstLeg, secondLeg],
            } as XWingRawHint)

            if (xWingType !== XWING_TYPES.INVALID) {
                const xWing = {
                    houseType,
                    type: xWingType,
                    legs: [firstLeg, secondLeg],
                }
                xWing.legs = transformValidXWingLegs(xWing)
                if (removableNotesPresentInCrossHouse(xWing, notes)) result.push(xWing)
            }
        }
    }
    return result
}

export const getXWingRawHints = (mainNumbers: MainNumbers, notesData: Notes, maxHintsThreshold: number) => {
    const result: XWingRawHint[] = []

    const candidateXWingLegs = getAllXWingEligibleCandidates(mainNumbers, notesData)

    const candidatesWithXWingLegs = Object.keys(candidateXWingLegs)
    for (let i = 0; i < candidatesWithXWingLegs.length; i++) {
        const candidate = candidatesWithXWingLegs[i]
        const xWingLegHouseTypes = Object.keys(candidateXWingLegs[candidate as unknown as number]) as HouseType[]
        for (let j = 0; j < xWingLegHouseTypes.length; j++) {
            if (maxHintsLimitReached(result, maxHintsThreshold)) break

            const houseType = xWingLegHouseTypes[j]
            const xWingLegsInHouses: XWingLeg[] = _get(candidateXWingLegs, [candidate, houseType], [])
            result.push(...getCandidateValidXWings(houseType, xWingLegsInHouses, notesData, maxHintsThreshold))
        }
    }

    return result
}
