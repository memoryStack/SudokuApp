import { areSameCells, areSameRowCells, areSameColCells, areSameBlockCells, isCellExists, getCellVisibleNotesCount } from '../util'
import { N_CHOOSE_K } from '../../../../resources/constants'
import { consoleLog, getBlockAndBoxNum, getRowAndCol } from '../../../../utils/util'
import { GROUPS, HINTS_IDS, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION, SMART_HINTS_CELLS_BG_COLOR } from './constants'
import { maxHintsLimitReached, setCellDataInHintResult, getCandidatesListText } from './util'
import { isHintValid } from './validityTest'

// put it in utils for other smart hints as well
const getHintExplanationSteps = hintChunks => {
    const result = hintChunks.map(hintChunk => {
        return { text: hintChunk }
    })
    result.push({
        isTryOut: true,
        text: 'try out',
    })
    return result
}

// put it in utils for other smart hints as well
const getTryOutInputPanelNumbersVisibility = allowedCandidates => {
    const numbersVisibility = new Array(10).fill(false)
    allowedCandidates.forEach(candidate => (numbersVisibility[candidate] = true))
    return numbersVisibility
}

const getNakedTrippleHintData = ({ groupCandidates, groupCells, focusedCells, cellsToFocusData }) => {
    const isNakedDoubles = groupCandidates.length === 2

    // const getCellsHostingText = () => {
    //     const groupCandidatesText = isNakedDoubles
    //         ? `${groupCandidates[0]}, and another one ${groupCandidates[1]}`
    //         : `${groupCandidates[0]}, another ${groupCandidates[1]}, and the last ${groupCandidates[2]}`
    //     return `So one of the squares has to be ${groupCandidatesText} (which is which is yet unknown).`
    // }

    // TODO: explore if we can use the below array for naked double and naked tripple as well in same way
    const candidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
    const hintChunks = [
        `A Naked Tripple is a set of three candidates filled in three cells that are part of same row, column or box.\nNote: these three cells collectively can't have more than 3 different candidates`,
        `${candidatesListText} make a naked tripple in the highlighted region. in the solution ${candidatesListText} will be placed in Naked Tripple cells only and all the candidates of these numbers can be removed from other cells of the highlighted region. ${candidatesListText} will go in exactly which Naked Tripple cell is yet not clear.`,
    ]

    return {
        hasTryOut: true,
        cellsToFocusData,
        focusedCells,
        type: isNakedDoubles ? HINTS_IDS.NAKED_DOUBLE : HINTS_IDS.NAKED_TRIPPLE,
        title: isNakedDoubles ? 'Naked Double' : 'Naked Tripple',
        steps: getHintExplanationSteps(hintChunks),
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates),
    }
}

const removeDuplicteCells = (cells) => {
    const result = []
    cells.forEach((cell) => {
        if (!isCellExists(cell, result)) result.push(cell)
    })
    return result
}

// TODO: write test case for it and refactor it properly
const prepareNakedDublesOrTriplesHintData = (
    noOfInstances,
    cellsHighlightable,
    groupCells,
    groupCandidates,
    notesData,
) => {

    // TODO: found an issue while testing tryOut analyser for naked tripple.
    // i wish has developed it using TDD
    const toBeHighlightedCells = removeDuplicteCells(cellsHighlightable)

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

    if (!isNakedDoubles) {
        return getNakedTrippleHintData({
            groupCandidates,
            cellsToFocusData,
            focusedCells: toBeHighlightedCells,
            groupCells,
        })
    }

    const candidatesListText = getCandidatesListText(groupCandidates, HINT_TEXT_CANDIDATES_JOIN_CONJUGATION.AND)
    const hintChunks = [
        `A Naked Double is a set of two candidates filled in two cells that are part of same row, column or box.\nNote: these two cells can't have more than 2 different set of candidates`,
        `${candidatesListText} make a naked double in the highlighted region. in the solution ${candidatesListText} will be placed in Naked Double cells only and all the candidates of ${candidatesListText} can be removed from other cells of the highlighted region. ${candidatesListText} will go in exactly which Naked Double cell is yet not clear.`,
    ]

    return {
        hasTryOut: true,
        focusedCells: toBeHighlightedCells,
        cellsToFocusData,
        type: isNakedDoubles ? HINTS_IDS.NAKED_DOUBLE : HINTS_IDS.NAKED_TRIPPLE,
        title: isNakedDoubles ? 'Naked Double' : 'Naked Tripple',
        tryOutAnalyserData: {
            groupCandidates,
            focusedCells: toBeHighlightedCells,
            groupCells,
        },
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(groupCandidates),
        steps: getHintExplanationSteps(hintChunks),
    }
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

    hintsSearchLoop: for (let j = 0; j < houseType.length; j++) {
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
                        groupCandidates: groupCandidates.map(candidate => parseInt(candidate, 10)),
                        hostCells: selectedBoxes,
                    },
                })
                if (isValidNakedGroup) {
                    consoleLog('@@@@ naked group', selectedBoxes, groupCandidates)
                    hints.push(
                        prepareNakedDublesOrTriplesHintData(
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

    return hints.length !== 0 ? hints : null
}
