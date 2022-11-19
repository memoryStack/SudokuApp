import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog } from '../../../../../utils/util'

import { CELLS_IN_HOUSE, HOUSES_COUNT, NUMBERS_IN_HOUSE } from '../../../constants'

import {
    areSameCells,
    areSameRowCells,
    areSameColCells,
    areSameBlockCells,
    getCellVisibleNotesCount,
    getRowAndCol,
    getBlockAndBoxNum,
} from '../../util'

import { isHintValid } from '../validityTest'
import {
    maxHintsLimitReached,
} from '../util'
import {
    GROUPS, HOUSE_TYPE,
} from '../constants'
import { prepareNakedDublesOrTriplesHintData } from './uiHighlightData'

// TODO: fix this parsing issue. at a lot of places we are
// parsing the groupCandidates into their int form

// this func is used for a very special case in below func
const getHouseCellsNum = (cells, houseType) => {
    let result = []
    if (houseType === 'row' || houseType === 'col') { // this block is not doing anything useful
        const cellNumKey = houseType === 'row' ? 'col' : 'row'
        result = cells.map(cell => cell[cellNumKey])
    }
    result = cells.map(cell => {
        const { boxNum } = getBlockAndBoxNum(cell)
        return boxNum
    })
    // the result will container numbers [0...9] so normal sort works
    return result.sort()
}

// TODO: break this file
// TODO: think over the namings harder. i see a lot of in-consistencies
// around 200 lines long function 
export const highlightNakedDoublesOrTriples = (noOfInstances, notesData, sudokuBoard, maxHintsThreshold) => {
    const houseType = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]

    const groupsFoundInHouses = {
        [HOUSE_TYPE.ROW]: {},
        [HOUSE_TYPE.COL]: {},
        [HOUSE_TYPE.BLOCK]: {},
    }

    const hints = []

    hintsSearchLoop: for (let j = 0; j < houseType.length; j++) {
        for (let i = 0; i < HOUSES_COUNT; i++) {
            const houseNum = {
                row: i,
                col: i,
                block: i,
            }

            const houseAllBoxes = [] // all the house boxes
            const validBoxes = [] // all  the boxes with favorable number of instances in them
            for (let box = 0; box < CELLS_IN_HOUSE; box++) {
                let row
                let col
                if (houseType[j] === 'row') { // can put check like these inside a class with static methods
                    row = houseNum.row
                    col = box
                }
                if (houseType[j] === 'col') {
                    row = box
                    col = houseNum.col
                }
                if (houseType[j] === 'block') {
                    const obj = getRowAndCol(houseNum.block, box)
                    row = obj.row
                    col = obj.col
                }
                houseAllBoxes.push({ row, col })

                if (sudokuBoard[row][col].value) continue

                // i guess we can store info for notes here only and then use that down below. What is this ??
                const boxVisibleNotesCount = getCellVisibleNotesCount(notesData[row][col])
                const MINIMUM_INSTANCES_IN_MULTIPLE_THRESHOLD = 2
                if (
                    boxVisibleNotesCount >= MINIMUM_INSTANCES_IN_MULTIPLE_THRESHOLD &&
                    boxVisibleNotesCount <= noOfInstances
                )
                    validBoxes.push({ row, col })
            }

            const validBoxesCount = validBoxes.length
            // TODO: check the below threshold for naked multiple cases.
            const VALID_BOXES_COUNT_THRESHOLD_TO_SEARCH = 6 // to avoid computing 7C2 and 7C3, because that might be heavy
            if (validBoxesCount > VALID_BOXES_COUNT_THRESHOLD_TO_SEARCH || validBoxesCount < noOfInstances) continue
            const possibleSelections = N_CHOOSE_K[validBoxesCount][noOfInstances]

            for (let k = 0; k < possibleSelections.length; k++) {
                if (maxHintsLimitReached(hints, maxHintsThreshold)) {
                    break hintsSearchLoop
                }

                const selectedBoxes = []
                for (let x = 0; x < possibleSelections[k].length; x++) {
                    const selectedIndex = possibleSelections[k][x]
                    const box = validBoxes[selectedIndex]
                    selectedBoxes.push(box)
                }

                // check these boxes if they are covered or not already
                if (houseType[j] === 'row' || houseType[j] === 'col') {
                    // TODO: let's wrap this condition into a func
                    const selectedCellsNum = getHouseCellsNum(selectedBoxes, houseType[j])
                    const houseCellsProcessed = groupsFoundInHouses[houseType[j]][`${i}`] || []
                    let cellsProcessedAlready = houseCellsProcessed.length === selectedCellsNum.length
                    // run loop and check one by one
                    for (let idx = 0; idx < selectedCellsNum.length && cellsProcessedAlready; idx++)
                        cellsProcessedAlready = houseCellsProcessed[idx] === selectedCellsNum[idx]
                    if (cellsProcessedAlready) continue
                }

                const eachVisibleNotesInfo = {} // will store the visible notes info from all the selected boxes
                for (let x = 0; x < selectedBoxes.length; x++) {
                    const { row, col } = selectedBoxes[x]
                    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
                        if (notesData[row][col][note - 1].show) {
                            if (!eachVisibleNotesInfo[note]) eachVisibleNotesInfo[note] = 1
                            else eachVisibleNotesInfo[note]++
                        }
                    }
                }

                const groupCandidates = Object.keys(eachVisibleNotesInfo)
                let shouldAbort = groupCandidates.length !== noOfInstances
                for (let x = 0; x < groupCandidates.length; x++) {
                    const count = eachVisibleNotesInfo[groupCandidates[x]]
                    if (!(count >= 2 && count <= noOfInstances)) {
                        // TODO: this needs to be checked again
                        shouldAbort = true
                        break
                    }
                }

                if (shouldAbort) continue // analyze some other combination of cells

                // if house is row or col
                if ((houseType[j] === 'row' || houseType[j] === 'col') && areSameBlockCells(selectedBoxes)) {
                    const { blockNum } = getBlockAndBoxNum(selectedBoxes[0])
                    for (let boxNum = 0; boxNum < CELLS_IN_HOUSE; boxNum++) {
                        const { row, col } = getRowAndCol(blockNum, boxNum)
                        if (
                            (houseType[j] === 'row' && row !== houseNum[houseType[j]]) ||
                            (houseType[j] === 'col' && col !== houseNum[houseType[j]])
                        )
                            houseAllBoxes.push({ row, col })
                    }
                } else {
                    if (areSameRowCells(selectedBoxes)) {
                        const { row } = selectedBoxes[0]
                        for (let col = 0; col < CELLS_IN_HOUSE; col++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum[houseType[j]] !== blockNum) houseAllBoxes.push({ row, col })
                        }
                    } else if (areSameColCells(selectedBoxes)) {
                        const { col } = selectedBoxes[0]
                        for (let row = 0; row < CELLS_IN_HOUSE; row++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum[houseType[j]] !== blockNum) houseAllBoxes.push({ row, col })
                        }
                    }
                }

                const groupWillRemoveCandidates = houseAllBoxes.some(cell => {
                    const isSelectedCell = selectedBoxes.some(selectedCell => {
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
                groupsFoundInHouses[houseType[j]][`${i}`] = getHouseCellsNum(selectedBoxes, houseType[j])
                if (houseAllBoxes.length === 15) {
                    // group cells belong to 2 houses, one is block for sure and another one can be either row or col
                    if (areSameRowCells(selectedBoxes)) {
                        const { row } = selectedBoxes[0]
                        groupsFoundInHouses['row'][`${row}`] = getHouseCellsNum(selectedBoxes, 'row')
                    } else {
                        const { col } = selectedBoxes[0]
                        groupsFoundInHouses['col'][`${col}`] = getHouseCellsNum(selectedBoxes, 'col')
                    }
                }

                const isValidNakedGroup = isHintValid({
                    type: GROUPS.NAKED_GROUP,
                    data: {
                        groupCandidates: groupCandidates.map(candidate => parseInt(candidate, 10)),
                        hostCells: selectedBoxes,
                    },
                })
                if (isValidNakedGroup) {
                    consoleLog('@@@@ naked group', selectedBoxes, groupCandidates)
                    const groupCandidatesInInt = groupCandidates.map(groupCandidate => parseInt(groupCandidate, 10))
                    hints.push(
                        prepareNakedDublesOrTriplesHintData(
                            noOfInstances,
                            houseAllBoxes,
                            selectedBoxes,
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
