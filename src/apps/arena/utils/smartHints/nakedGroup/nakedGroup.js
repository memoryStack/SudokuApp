import _filter from 'lodash/src/utils/filter'
import _map from 'lodash/src/utils/map'

import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, inRange } from '../../../../../utils/util'

import { CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import {
    areSameCells,
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getCellVisibleNotesCount,
    getRowAndCol,
    getBlockAndBoxNum,
    isCellEmpty,
    areSameCellsSets,
} from '../../util'

import { isHintValid } from '../validityTest'
import {
    maxHintsLimitReached,
} from '../util'
import {
    GROUPS, HOUSE_TYPE,
} from '../constants'
import { prepareNakedDublesOrTriplesHintData } from './uiHighlightData'
import { Houses } from '../../classes/houses'
import { getHouseCells } from '../../houseCells'

// TODO: fix this parsing issue. at a lot of places we are
// parsing the groupCandidates into their int form

// TODO: move these constants 
const VALID_CELL_MINIMUM_NOTES_COUNT = 2
const MAX_VALID_CELLS_COUNT = 6

const getHouseCellsNum = (cells) => {
    return cells.map(cell => getBlockAndBoxNum(cell).boxNum)
        .sortNumbers()
}

export const filterValidCellsInHouse = (house, groupCandidatesCount, mainNumbers, notesData) => {
    return _filter(getHouseCells(house), (cell) => {
        if (!isCellEmpty(cell, mainNumbers)) return false

        return inRange(
            getCellVisibleNotesCount(notesData[cell.row][cell.col]),
            { start: VALID_CELL_MINIMUM_NOTES_COUNT, end: groupCandidatesCount, }
        )
    })
}

const getDefaultGroupsFoundInHouses = () => {
    return {
        [HOUSE_TYPE.ROW]: {},
        [HOUSE_TYPE.COL]: {},
        [HOUSE_TYPE.BLOCK]: {},
    }
}

// TODO: think over the namings harder. i see a lot of in-consistencies
export const highlightNakedDoublesOrTriples = (groupCandidatesCount, notesData, mainNumbers, maxHintsThreshold) => {
    const houseType = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]

    const groupsFoundInHouses = getDefaultGroupsFoundInHouses()

    const hints = []

    hintsSearchLoop: for (let j = 0; j < houseType.length; j++) {
        for (let houseNum = 0; houseNum < HOUSES_COUNT; houseNum++) {
            const house = { type: houseType[j], num: houseNum }
            const houseAllCells = getHouseCells(house)
            const validCells = filterValidCellsInHouse(house, groupCandidatesCount, mainNumbers, notesData)

            // to avoid computing 7C2 and 7C3, because that might be heavy but it's open for research
            if (!inRange(validCells.length, { start: groupCandidatesCount, end: MAX_VALID_CELLS_COUNT })) continue

            const possibleSelections = N_CHOOSE_K[validCells.length][groupCandidatesCount]

            for (let k = 0; k < possibleSelections.length; k++) {
                // finding for new conbination of cells or numbers
                if (maxHintsLimitReached(hints, maxHintsThreshold)) {
                    break hintsSearchLoop
                }

                const selectedCells = _map(possibleSelections[k], (selectionIndex) => validCells[selectionIndex])

                // check these boxes if they are covered or not already
                if (Houses.isRowHouse(houseType[j]) || Houses.isColHouse(houseType[j])) {
                    // TODO: let's wrap this condition into a func
                    // QUES -> why are we assuming that only one group is possible in a house ??
                    const selectedCellsNum = getHouseCellsNum(selectedCells, house.type)
                    const houseCellsProcessed = groupsFoundInHouses[house.type][`${houseNum}`] || []
                    if (houseCellsProcessed.sameArrays(selectedCellsNum)) continue
                }

                const eachVisibleNotesInfo = {} // will store the visible notes info from all the selected boxes
                for (let x = 0; x < selectedCells.length; x++) {
                    const { row, col } = selectedCells[x]
                    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
                        if (notesData[row][col][note - 1].show) {
                            if (!eachVisibleNotesInfo[note]) eachVisibleNotesInfo[note] = 1
                            else eachVisibleNotesInfo[note]++
                        }
                    }
                }

                const groupCandidates = Object.keys(eachVisibleNotesInfo)
                let shouldAbort = groupCandidates.length !== groupCandidatesCount
                for (let x = 0; x < groupCandidates.length; x++) {
                    const count = eachVisibleNotesInfo[groupCandidates[x]]
                    if (!(count >= 2 && count <= groupCandidatesCount)) {
                        // TODO: this needs to be checked again
                        shouldAbort = true
                        break
                    }
                }

                if (shouldAbort) continue // analyze some other combination of cells

                // if house is row or col
                if ((Houses.isRowHouse(houseType[j]) || Houses.isColHouse(houseType[j])) && areSameBlockCells(selectedCells)) {
                    const { blockNum } = getBlockAndBoxNum(selectedCells[0])
                    for (let boxNum = 0; boxNum < CELLS_IN_HOUSE; boxNum++) {
                        const { row, col } = getRowAndCol(blockNum, boxNum)
                        if (
                            (Houses.isRowHouse(houseType[j]) && row !== houseNum) ||
                            (Houses.isColHouse(houseType[j]) && col !== houseNum)
                        )
                            houseAllCells.push({ row, col })
                    }
                } else {
                    if (areSameRowCells(selectedCells)) {
                        const { row } = selectedCells[0]
                        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum !== blockNum) houseAllCells.push({ row, col })
                        }
                    } else if (areSameColCells(selectedCells)) {
                        const { col } = selectedCells[0]
                        for (let row = 0; row < CELLS_IN_HOUSE; row++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum !== blockNum) houseAllCells.push({ row, col })
                        }
                    }
                }

                const groupWillRemoveCandidates = houseAllCells.some(cell => {
                    const isSelectedCell = selectedCells.some(selectedCell => {
                        return areSameCells(cell, selectedCell)
                    })
                    return (
                        !isSelectedCell &&
                        groupCandidates.some(groupCandidate => {
                            const groupCandidateNum = parseInt(groupCandidate, 10)
                            return notesData[cell.row][cell.col][groupCandidateNum - 1].show
                        })
                    )
                })

                if (!groupWillRemoveCandidates) continue

                // Note: the correctness of this DS depends on entries order in "houseType"
                groupsFoundInHouses[house.type][`${houseNum}`] = getHouseCellsNum(selectedCells, house.type)
                if (houseAllCells.length === 15) {
                    // group cells belong to 2 houses, one is block for sure and another one can be either row or col
                    if (areSameRowCells(selectedCells)) {
                        const { row } = selectedCells[0]
                        groupsFoundInHouses[HOUSE_TYPE.ROW][`${row}`] = getHouseCellsNum(selectedCells, HOUSE_TYPE.ROW)
                    } else {
                        const { col } = selectedCells[0]
                        groupsFoundInHouses[HOUSE_TYPE.COL][`${col}`] = getHouseCellsNum(selectedCells, HOUSE_TYPE.COL)
                    }
                }

                const isValidNakedGroup = isHintValid({
                    type: GROUPS.NAKED_GROUP,
                    data: {
                        groupCandidates: groupCandidates.map(candidate => parseInt(candidate, 10)),
                        hostCells: selectedCells,
                    },
                })
                if (isValidNakedGroup) {
                    consoleLog('@@@@ naked group', selectedCells, groupCandidates)
                    const groupCandidatesInInt = groupCandidates.map(groupCandidate => parseInt(groupCandidate, 10))
                    hints.push(
                        prepareNakedDublesOrTriplesHintData(
                            groupCandidatesCount,
                            houseAllCells,
                            selectedCells,
                            groupCandidatesInInt,
                            notesData,
                        ),
                    )
                }
            }
        }
    }

    return hints.length !== 0 ? hints : null
}
