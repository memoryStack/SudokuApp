import { areSameCells, areSameRowCells, areSameColCells, areSameBlockCells, isCellEmpty, getCellVisibleNotesCount, isCellNoteVisible } from '../util'
import { N_CHOOSE_K } from '../../../../resources/constants'
import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../../utils/util'
import { GROUPS, SMART_HINTS_CELLS_BG_COLOR } from './constants'
import { maxHintsLimitReached, setCellDataInHintResult } from './util'
import { isHintValid } from './validityTest'
import { getMainNumbers, getNotesInfo } from '../../store/selectors/board.selectors'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'

// TODO: move it to utils for other hints to use
// TODO: don't pass the global data in the args like tryOutMainNumbers
const noInputInTryOut = (tryOutMainNumbers, focusedCells) => {
    const actualMainNumbers = getMainNumbers(getStoreState())

    const result = []
    focusedCells.forEach((cell) => {
        const isCellFilledInTryOut = isCellEmpty(cell, actualMainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
        if (isCellFilledInTryOut) {
            result.push({
                cell,
                number: tryOutMainNumbers[cell.row][cell.col].value
            })
        }
    })

    return result.length === 0
}

const getTryOutErrorType = (tryOutMainNumbers, tryOutNotesInfo, groupCandidates, focusedCells) => {
    // these errors can be put in utils individually
    const cellWithoutAnyCandidates = focusedCells.some((cell) => {
        return isCellEmpty(cell, tryOutMainNumbers) && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 0)
    })
    if (cellWithoutAnyCandidates) {
        return 'EMPTY_CELL_IN_SOLUTION'
    }

    const candidatesNakedSingleInMultipleCells = groupCandidates.filter((candidate) => {
        const candidateNakedSingleHostCells = focusedCells.filter((cell) => {
            return isCellNoteVisible(candidate, tryOutNotesInfo[cell.row][cell.col])
                && (getCellVisibleNotesCount(tryOutNotesInfo[cell.row][cell.col]) === 1)
        })
        return candidateNakedSingleHostCells.length > 1
    })
    if (candidatesNakedSingleInMultipleCells.length) {
        return 'MULTIPLE_CELLS_NAKED_SINGLE'
    }

    return ''
}

const getCorrectFilledTryOutCandidates = (groupCells, tryOutMainNumbers) => {
    const result = []
    groupCells.forEach((cell) => {
        if (!isCellEmpty(cell, tryOutMainNumbers)) {
            result.push( tryOutMainNumbers[cell.row][cell.col].value)
        }
    })
    return result
}

const getCandidatesToBeFilled = (correctlyFilledGroupCandidates, groupCandidates) => {
    return groupCandidates.map((candidate) => {
        return parseInt(candidate, 10)
    }).filter((groupCandidate) => {
        return !correctlyFilledGroupCandidates.includes(groupCandidate)
    })
}

// every hint constructor should pass try-out needed data seperately in the state
const tryOutAnalyser = (cellsToFocusData, groupCandidates, focusedCells, groupCells) => {

    const getCandidatesListForTryOutMsg = () => {
        const isNakedDoubles = groupCandidates.length === 2
        return isNakedDoubles
            ? `${groupCandidates[0]} or ${groupCandidates[1]}`
            : `${groupCandidates[0]}, ${groupCandidates[1]} or ${groupCandidates[2]}`
    }

    return (tryOutMainNumbers, tryOutNotesInfo) => {
        if (noInputInTryOut(tryOutMainNumbers, focusedCells)) {
            return `try filling ${getCandidatesListForTryOutMsg()} in the cells where`
            + ` it is highlighted in red or green color to see how this hint works`
        }

        const tryOutErrorType = getTryOutErrorType(tryOutMainNumbers, tryOutNotesInfo, groupCandidates, focusedCells)

        // switch kind of handling
        // display these kind of messages in red color
        if (tryOutErrorType === 'EMPTY_CELL_IN_SOLUTION') {
            return `one or more cells have no candidates in them. undo your move.`
        } else if (tryOutErrorType === 'MULTIPLE_CELLS_NAKED_SINGLE') {
            return `candidate highlighted in green color can't be naked single for more than 1 cell in a house. undo your move.`
        }

        // one or more candidates are filled in correct place. prepare messages for this state.

        const getFilledCandidatesListForGreenState = (candidates) => {
            if (candidates.length === 1) return `${candidates[0]}`

            return candidates.reduce((prevValue, currentCandidate, currentIndex) => {
                if (currentIndex === 0) return currentCandidate

                const isLastElement = currentIndex === candidates.length - 1
                const joint = isLastElement ? ' and ' : ', '
                return prevValue + joint + currentCandidate
            }, '')
        }

        // highlight this message in green color
        // hinting user that it is the one of the right path
        const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
        
        if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
            // all the candidates are filed in their cells in some order.
            // tell user that this arrangement can be a valid solution in the final solved solution.
            return `${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)} are filled in the`
                + ` cells without getting into any invalid state for the highlighted region.`
                + ` we don't know the exact solution for these cells yet but we are sure`
                + ` that ${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)}`
                + ` will belong to these cells only in the highlighted region and not anywhere else.`
        } else { 
            const candidatesToBeFilled = getCandidatesToBeFilled(correctlyFilledGroupCandidates, groupCandidates)
            console.log('@@@@@@ candidatesToBeFilled', candidatesToBeFilled)
            return `${getFilledCandidatesListForGreenState(correctlyFilledGroupCandidates)}`
                + ` ${correctlyFilledGroupCandidates.length === 1 ? 'is' : 'are'} filled properly.`
                + ` fill ${getFilledCandidatesListForGreenState(candidatesToBeFilled)} as well`
                + ` to find where these numbers can come in the highlighted region.`
        }
    }
}

// seperate the above code in it's file
////////////////////////////////////////////////////////////////////////////////////////////////////

// TODO: write test case for it and refactor it properly
const prepareNakedDublesOrTriplesHintData = (
    noOfInstances,
    toBeHighlightedCells,
    groupCells,
    groupCandidates,
    notesData,
) => {
    const isNakedDoubles = noOfInstances === 2
    const cellsToFocusData = {}

    const isGroupHostCell = cell => groupCells.some(groupCell => areSameCells(groupCell, cell))

    toBeHighlightedCells.forEach(({ row, col }) => {
        const cellHighlightData = { bgColor: SMART_HINTS_CELLS_BG_COLOR.IN_FOCUS_DEFAULT }

        const notesToHighlightData = {}
        let notesWillBeHighlighted = false
        groupCandidates.forEach(groupCandidate => {
            const groupCandidateNum = parseInt(groupCandidate, 10)
            if (notesData[row][col][groupCandidateNum - 1].show) {
                if (isGroupHostCell({ row, col })) {
                    notesToHighlightData[groupCandidate] = { fontColor: 'green' }
                } else {
                    notesToHighlightData[groupCandidate] = { fontColor: 'red' }
                }
                notesWillBeHighlighted = true
            }
        })

        if (notesWillBeHighlighted) cellHighlightData.notesToHighlightData = notesToHighlightData
        setCellDataInHintResult({ row, col }, cellHighlightData, cellsToFocusData)
    })

    const groupCellsCountEnglishText = isNakedDoubles ? 'two' : 'three'
    const getGroupCandidatesListText = () => {
        return isNakedDoubles
            ? `${groupCandidates[0]} and ${groupCandidates[1]}`
            : `${groupCandidates[0]}, ${groupCandidates[1]} and ${groupCandidates[2]}`
    }

    const getCellsHostingText = () => {
        const groupCandidatesText = isNakedDoubles
            ? `${groupCandidates[0]}, and another one ${groupCandidates[1]}`
            : `${groupCandidates[0]}, another ${groupCandidates[1]}, and the last ${groupCandidates[2]}`

        return `So one of the squares has to be ${groupCandidatesText} (which is which is yet unknown).`
    }

    // TODO: this msg needs to be simplified for tripple case [{1,2}, {1,2,3}, {2, 3}]
    // this case doesn't fit exactly in the below explaination
    const hintMessage = () =>
        `In the highlighted region, ${groupCellsCountEnglishText} cells have exactly same candidates ${getGroupCandidatesListText()} highlighted in green color. ${getCellsHostingText()} So ${getGroupCandidatesListText()} highlighted in red color can't appear there and we can erase these instances from these cells`

    const hintList = [
        `A Naked Pair is a set of two candidate numbers filled in two cells that belong to at least one unit in common. That is, they reside in the same row, column or box.\nNote: these two cells can't have more than 2 different set of candidates`,
        `${groupCandidates[0]} and ${groupCandidates[1]} make a naked double in the highlighted region. in the solution ${groupCandidates[0]} and ${groupCandidates[1]} will be placed in Naked Double cells only and all the candidates of ${groupCandidates[0]} and ${groupCandidates[1]} can be removed from other cells of the highlighted region. ${groupCandidates[0]} and ${groupCandidates[1]} will go in exactly which Naked Pair cell is yet not clear.`,
        `let's say that ${groupCandidates[0]} can't come in any of Naked Pair cells then ${groupCandidates[1]} has to come in both Naked Pair cells, if we do so then solution will be invalid. we can try it with the ${groupCandidates[1]} as well but solution will be invalid in both the cases.`,
        `try out`
    ]

    const getTryOutInputPanelNumbersVisibility = () => {
        const numbersVisibility = new Array(10).fill(false)
        groupCandidates.forEach((candidate) => numbersVisibility[candidate] = true)
        return numbersVisibility
    }

    // TODO: add support for enabling only the input panel numbers
    // which are relevant for the hint
    // TODO: Handle it properly
    return hintList.map((hintChunk) => {
        const isTryOut = hintChunk === 'try out'
        const hintStepData = {
            key: isTryOut ? 'TRY_OUT' : '',
            focusedCells: toBeHighlightedCells, // TODO: simplify these two types of cells. it's getting confusing.
            cellsToFocusData,
            techniqueInfo: {
                title: isNakedDoubles ? 'Naked Double' : 'Naked Tripple',
                logic: hintChunk,
            },
        }

        if (isTryOut) {
            hintStepData.inputPanelNumbersVisibility = getTryOutInputPanelNumbersVisibility()
            hintStepData.tryOutAnalyser = tryOutAnalyser(cellsToFocusData, groupCandidates, toBeHighlightedCells, groupCells)
        }

        return hintStepData
    })


    // return an araay from here in multistep
    return {
        cellsToFocusData,
        techniqueInfo: {
            title: isNakedDoubles ? 'Naked Double' : 'Naked Tripple',
            logic: hintMessage(),
        },
    }
}

// TODO: there can be multiple doubles and triples in the highlighted region
//         how to tackle those cases so that user get most benefit ??
// TODO: for yWing hint have added such a function. use that and replace this func
const getVisibileNotesCount = ({ row, col }, notesData) => {
    let result = 0
    for (let note = 1; note <= 9; note++) {
        if (notesData[row][col][note - 1].show) result++
    }
    return result
}

// this func is used for a very special case in below func
const getHouseCellsNum = (cells, houseType) => {
    let result = []
    if (houseType === 'row' || houseType === 'col') {
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
export const highlightNakedDoublesOrTriples = (noOfInstances, notesData, sudokuBoard, maxHintsThreshold) => {
    const houseType = ['block', 'row', 'col']

    const groupsFoundInHouses = {
        row: {},
        col: {},
        block: {},
    }

    const hints = []

    hintsSearchLoop:
    for (let j = 0; j < houseType.length; j++) {
        for (let i = 0; i < 9; i++) {
            const houseNum = {
                row: i,
                col: i,
                block: i,
            }

            const houseAllBoxes = [] // all the house boxes
            const validBoxes = [] // all  the boxes with favorable number of instances in them
            for (let box = 0; box < 9; box++) {
                let row
                let col
                if (houseType[j] === 'row') {
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
                const boxVisibleNotesCount = getVisibileNotesCount({ row, col }, notesData)
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
                    for (let note = 1; note <= 9; note++) {
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
                    for (let boxNum = 0; boxNum < 9; boxNum++) {
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
                        for (let col = 0; col < 9; col++) {
                            const { blockNum } = getBlockAndBoxNum({ row, col })
                            if (houseNum[houseType[j]] !== blockNum) houseAllBoxes.push({ row, col })
                        }
                    } else if (areSameColCells(selectedBoxes)) {
                        const { col } = selectedBoxes[0]
                        for (let row = 0; row < 9; row++) {
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
                        groupCandidates: groupCandidates.map((candidate) => parseInt(candidate, 10)),
                        hostCells: selectedBoxes
                    },
                })
                if (isValidNakedGroup) {
                    consoleLog('@@@@ naked double', selectedBoxes, groupCandidates)
                    hints.push(
                        ...prepareNakedDublesOrTriplesHintData( // an array of hints pieces will be returned
                            noOfInstances,
                            houseAllBoxes,
                            selectedBoxes,
                            groupCandidates,
                            notesData,
                        ),
                    )
                }
            }
        }
    }

    return {
        present: hints.length > 0,
        returnData: hints,
    }
}
