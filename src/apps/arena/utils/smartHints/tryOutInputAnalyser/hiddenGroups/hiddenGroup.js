import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _sortBy from '@lodash/sortBy'
import _unique from '@lodash/unique'

import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'

import { formatMessage } from '@utils/util'

import { filterEmptyCells, sortCells } from '../../../util'

import { getCellsAxesValuesListText } from '../../rawHintTransformers/helpers'
import { getCandidatesListText, getAxisValuesFromTranslations, getHouseWithNumAndNameText } from '../../util'

import { TRY_OUT_RESULT_STATES } from '../constants'
import { getCandidatesToBeFilled, getCorrectFilledTryOutCandidates, noInputInTryOut } from '../helpers'

export const hiddenGroupTryOutAnalyser = (
    {
        groupCandidates, groupCells, removableGroupCandidatesHostCells, primaryHouse,
    },
    boardInputs,
    smartHintsTranslationsTexts,
) => {
    if (noInputInTryOut([...groupCells, ...removableGroupCandidatesHostCells], boardInputs)) {
        return getNoInputResult(smartHintsTranslationsTexts)
    }

    if (removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells, boardInputs).length) {
        return removableGroupCandidatesFilledResult(removableGroupCandidatesHostCells, primaryHouse, boardInputs, smartHintsTranslationsTexts)
    }

    if (someGroupCellWronglyFilled(groupCells, groupCandidates, boardInputs)) {
        return groupCellWronglyFilledResult(groupCells, groupCandidates, primaryHouse, boardInputs, smartHintsTranslationsTexts)
    }

    return correctlyFilledGroupCellsResult(groupCells, groupCandidates, boardInputs, smartHintsTranslationsTexts)
}

const getNoInputResult = (smartHintsTranslationsTexts) => ({
    msg: smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.noInput,
    state: TRY_OUT_RESULT_STATES.START,
})

const removableGroupCandidatesFilledHostCells = (removableGroupCandidatesHostCells, { tryOutMainNumbers }) => removableGroupCandidatesHostCells.filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))

const removableGroupCandidatesFilledResult = (removableGroupCandidatesHostCells, primaryHouse, boardInputs, smartHintsTranslationsTexts) => {
    const filledCellsWithNumbers = getRemovableGroupCandidatesFilledCellsWithNumbers(removableGroupCandidatesHostCells, boardInputs)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const isPlural = filledCellsWithNumbers.length > 1
    const msgPlaceholderValues = {
        primaryHouseFullName: getHouseWithNumAndNameText(
            primaryHouse,
            smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.config.primaryHouseFullName,
            smartHintsTranslationsTexts
        ),
        filledCandidatesListText: getCandidatesListText(getNumbersFromCellsWithNumbers(filledCellsWithNumbers)),
        filledCellsAxesListText: getCellsAxesValuesListText(getCellsFromCellsWithNumbers(filledCellsWithNumbers), undefined, axisValues),
        filledInstancesHelpingVerb: smartHintsTranslationsTexts.common.helpingVerb[isPlural ? 'plural' : 'singular'],
        cellSingularPlural: smartHintsTranslationsTexts.common.houseTypes.cell[isPlural ? 'plural' : 'singular'],
        removableGCCount: filledCellsWithNumbers.length
    }
    return {
        msg: formatMessage(smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.removableGroupCandidateFilled, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getRemovableGroupCandidatesFilledCellsWithNumbers = (removableGroupCandidatesHostCells, boardInputs) => {
    const { tryOutMainNumbers } = boardInputs
    return removableGroupCandidatesFilledHostCells(removableGroupCandidatesHostCells, boardInputs)
        .map(cell => ({
            cell,
            number: MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell),
        }))
        .sort(({ number: cellANumber }, { number: cellBNumber }) => cellANumber - cellBNumber)
}

const getCellsFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ cell }) => cell)

const getNumbersFromCellsWithNumbers = cellsWithNumbers => cellsWithNumbers.map(({ number }) => number)

const someGroupCellWronglyFilled = (groupCells, groupCandidates, { tryOutMainNumbers }) => groupCells.some(cell => {
    if (!MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)) return false
    const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
    return !groupCandidates.includes(cellValue)
})

// TODO: can merge getWronglyFilledGroupCellsInfo and someGroupCellWronglyFilled
const getWronglyFilledGroupCellsInfo = (_groupCells, groupCandidates, { tryOutMainNumbers }) => {
    const result = []
    sortCells(_groupCells)
        .filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
        .forEach(cell => {
            const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
            if (!groupCandidates.includes(cellValue)) { result.push({ cell, number: cellValue }) }
        })
    return result
}

// TODO: break down this function
const groupCellWronglyFilledResult = (groupCells, groupCandidates, primaryHouse, boardInputs, smartHintsTranslationsTexts) => {
    let errorMsg
    const primaryHouseFullName = getHouseWithNumAndNameText(
        primaryHouse,
        smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.config.primaryHouseFullName,
        smartHintsTranslationsTexts
    )
    const groupCandidatesToBeFilled = getGroupCandidatesToBeFilled(groupCells, groupCandidates, boardInputs)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const groupCandidatesToBeFilledWithoutHostCells = getGroupCandidatesToBeFilledWithoutHostCells(
        groupCandidatesToBeFilled,
        groupCells,
        boardInputs,
    )

    const wronglyFilledGroupCellsInfo = getWronglyFilledGroupCellsInfo(groupCells, groupCandidates, boardInputs)
    const wronglyFilledGroupCells = getCellsFromCellsWithNumbers(wronglyFilledGroupCellsInfo)
    const wronglyFilledNumbersInGroupCells = getNumbersFromCellsWithNumbers(wronglyFilledGroupCellsInfo)
    const wronglyFilledNumbersInGroupCellsListText = getCandidatesListText(wronglyFilledNumbersInGroupCells)
    const wronglyFilledGroupCellsAxesListText = getCellsAxesValuesListText(wronglyFilledGroupCells, undefined, axisValues)

    let msgPlaceholderValues
    if (groupCandidatesToBeFilledWithoutHostCells.length !== 0) {
        msgPlaceholderValues = {
            primaryHouseFullName,
            candidatesListText: getCandidatesListText(_sortBy(groupCandidatesToBeFilledWithoutHostCells)),
            wronglyFilledNumbersInGroupCellsListText,
            wronglyFilledGroupCellsAxesListText,
        }
        errorMsg = smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.invalidCandidateInGroupCell.noHostCellForGroupCandidates
    } else {
        const { tryOutMainNumbers } = boardInputs
        const emptyGroupCells = sortCells(filterEmptyCells(groupCells, tryOutMainNumbers))
        const candidatesListText = getCandidatesListText(_sortBy(groupCandidatesToBeFilled))
        const emptyCellsAxesListText = getCellsAxesValuesListText(emptyGroupCells, undefined, axisValues)
        const candidatesCountWithoutCells = groupCandidatesToBeFilled.length - emptyGroupCells.length
        const emptyIsPlural = emptyGroupCells.length > 1

        msgPlaceholderValues = {
            candidatesToBeFilledCount: groupCandidatesToBeFilled.length,
            candidatesListText,
            emptyGroupCellsCount: emptyGroupCells.length,
            emptyGroupCellsNounText: smartHintsTranslationsTexts.common.houseTypes.cell[emptyIsPlural ? 'plural' : 'singular'],
            emptyCellsAxesListText,
            emptyGroupCellsHelpingVerb: smartHintsTranslationsTexts.common.helpingVerb[emptyIsPlural ? 'plural' : 'singular'],
            primaryHouseFullName,
            candidatesCountWithoutCells,
            wronglyFilledNumbersInGroupCellsListText,
            wronglyFilledGroupCellsAxesListText,
        }
        errorMsg = smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.invalidCandidateInGroupCell.insufficientHostCells
    }

    return {
        msg: dynamicInterpolation(errorMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getGroupCandidatesToBeFilledWithoutHostCells = (groupCandidatesToBeFilled, groupCells, { tryOutNotes }) => groupCandidatesToBeFilled.filter(groupCandidate => !groupCells.some(cell => NotesRecord.isNotePresentInCell(tryOutNotes, groupCandidate, cell)))

// TODO: break down this function
const correctlyFilledGroupCellsResult = (groupCells, groupCandidates, { tryOutMainNumbers, tryOutNotes }, smartHintsTranslationsTexts) => {
    const correctlyFilledGroupCandidates = getCorrectFilledTryOutCandidates(groupCells, tryOutMainNumbers)
    const axisValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    let progressMsg = ''
    let msgPlaceholderValues
    if (correctlyFilledGroupCandidates.length === groupCandidates.length) {
        msgPlaceholderValues = {
            candidatesListText: getCandidatesListText(_sortBy(groupCandidates)),
            groupCellsAxesListText: getCellsAxesValuesListText(sortCells(groupCells), undefined, axisValues),
        }
        progressMsg = smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.validFill.full
    } else {
        const correctlyFilledGroupCellsInfo = []
        sortCells(groupCells).filter(cell => MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell))
            .forEach(cell => {
                const cellValue = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell)
                correctlyFilledGroupCellsInfo.push({ cell, number: cellValue })
            })
        const filledGroupCells = getCellsFromCellsWithNumbers(correctlyFilledGroupCellsInfo)

        let candidatesToBeFilled = []
        groupCells.forEach(cell => {
            candidatesToBeFilled.push(...NotesRecord.getCellVisibleNotesList(tryOutNotes, cell))
        })
        candidatesToBeFilled = _sortBy(_unique(candidatesToBeFilled))
        const filledIsPlural = correctlyFilledGroupCandidates.length > 1
        const toBeFilledIsPlural = candidatesToBeFilled.length > 1

        msgPlaceholderValues = {
            filledCandidates: getCandidatesListText(correctlyFilledGroupCandidates),
            filledCandidatesCountHV: smartHintsTranslationsTexts.common.helpingVerb[filledIsPlural ? 'plural' : 'singular'],
            filledCandidatesHostCells: getCellsAxesValuesListText(filledGroupCells, undefined, axisValues),
            toBeFilledCandidates: getCandidatesListText(_sortBy(candidatesToBeFilled)),
            toBeFilledCandidatesPronoun: smartHintsTranslationsTexts.common.pronouns[toBeFilledIsPlural ? 'plural' : 'singular'],
            correctlyFilledGCCount: correctlyFilledGroupCandidates.length
        }
        progressMsg = smartHintsTranslationsTexts.tryOutAnalyser.hiddenGroup.validFill.partial
    }

    return {
        msg: formatMessage(progressMsg, msgPlaceholderValues),
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getGroupCandidatesToBeFilled = (groupCells, groupCandidates, { tryOutMainNumbers }) => {
    const filledCellsNumbers = groupCells.map(cell => MainNumbersRecord.getCellMainValue(tryOutMainNumbers, cell))
    return getCandidatesToBeFilled(filledCellsNumbers, groupCandidates)
}
