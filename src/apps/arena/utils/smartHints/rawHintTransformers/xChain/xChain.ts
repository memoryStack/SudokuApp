import _map from '@lodash/map'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'
import _keys from '@lodash/keys'
import _isNil from '@lodash/isNil'
import _compact from '@lodash/compact'
import _head from '@lodash/head'
import _reverse from '@lodash/reverse'
import _last from '@lodash/last'

import { BOARD_MOVES_TYPES } from '../../../../constants'
import {
    TransformedRawHint,
    SmartHintsColorSystem,
    CellsFocusData,
    Chain,
    NotesToHighlightData,
    NotesRemovalHintAction,
    InputPanelNumbersVisibility,
    TryOutInputsColors,
    ChainLink,
} from '../../types'
import { XChainTransformerArgs } from './types'
import { HINTS_IDS, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { XChainRawHint } from '../../chains/xChain/types'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    transformCellBGColor,
    setCellNotesHighlightDataInHintResult,
    getTryOutInputPanelNumbersVisibility,
} from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { LINK_TYPES } from '../../chains/xChain/xChain.constants'
import { convertBoardCellToNum } from '../../../cellTransformers'
import { getCellsAxesValuesListText, getHouseNumAndName, joinStringsListWithArrow } from '../helpers'
import { getCellAxesValues, getCellsCommonHousesInfo } from '../../../util'

// TODO: these colors are also used in remote pairs as well
const CHAIN_CELLS_NOTES_COLORS_TEXT = ['blue', 'green']

const CHAIN_CELLS_NOTES_COLORS = ['#4B61D1', 'green']

const getUICellsToFocusData = (xChain: XChainRawHint, smartHintsColorSystem: SmartHintsColorSystem): CellsFocusData => {
    const result = {}

    BoardIterators.forBoardEachCell(cell => {
        const cellHighlightData = { bgColor: transformCellBGColor(smartHintColorSystemReader.cellDefaultBGColor(smartHintsColorSystem)) }
        setCellDataInHintResult(cell, cellHighlightData, result)
    })

    const { note, removableNotesHostCells, chain: chainCells } = xChain

    _forEach(removableNotesHostCells, (cell: Cell) => {
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[note] = {
            fontColor: 'red',
        }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    _forEach(chainCells, (cell: Cell, indx: number) => {
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[note] = { fontColor: CHAIN_CELLS_NOTES_COLORS[indx % 2] }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    return result
}

const getExplainationStepsText = (xChain: XChainRawHint, chainLinks: Chain) => {
    const { note, chain, removableNotesHostCells } = xChain

    const chainNotesFillingTextTemplates = {
        firstLinkExplaination: 'if {{linkSourceCell}} is not {{note}} then {{linkSinkCell}} has to be {{note}}({{note}}'
            + ' can come only in one of {{linkSourceCell}} or {{linkSinkCell}} in {{firstLinkHostHouse}})',
        otherLinkExplaination: '{{linkSourceCell}} can\'t be {{note}} then {{linkSinkCell}} has to be {{note}}',
    }

    const firstWayToFillChainCells = _compact(_map(chainLinks, (link: ChainLink, indx: number) => {
        const { start, end, type } = link
        if (type === LINK_TYPES.WEAK) return null
        const explainationText = indx === 0 ? chainNotesFillingTextTemplates.firstLinkExplaination
            : chainNotesFillingTextTemplates.otherLinkExplaination
        const placeholdersValues = {
            note,
            firstLinkHostHouse: getHouseNumAndName(_head(getCellsCommonHousesInfo([start.cell, end.cell]))),
            linkSourceCell: getCellAxesValues(start.cell),
            linkSinkCell: getCellAxesValues(end.cell),
        }
        return dynamicInterpolation(explainationText, placeholdersValues)
    })).join(', ')

    const reverseOrderChainNotesFillingTextTemplates = {
        firstLinkExplaination: 'if {{linkSourceCell}} is not {{note}} then {{linkSinkCell}} has to be {{note}}',
        otherLinkExplaination: '{{linkSourceCell}} can\'t be {{note}} then {{linkSinkCell}} has to be {{note}}',
    }
    const secondWayToFillChainCells = _compact(_map(_reverse([...chainLinks]), (link: ChainLink, indx: number) => {
        const { start, end, type } = link
        if (type === LINK_TYPES.WEAK) return null
        const explainationText = indx === 0 ? reverseOrderChainNotesFillingTextTemplates.firstLinkExplaination
            : reverseOrderChainNotesFillingTextTemplates.otherLinkExplaination
        const placeholdersValues = {
            note,
            firstLinkHostHouse: getHouseNumAndName(_head(getCellsCommonHousesInfo([start.cell, end.cell]))),
            linkSourceCell: getCellAxesValues(end.cell),
            linkSinkCell: getCellAxesValues(start.cell),
        }
        return dynamicInterpolation(explainationText, placeholdersValues)
    })).join(', ')

    const placeholdersValues = {
        note,
        chain: joinStringsListWithArrow(_map(chain, (chainCell: Cell) => getCellAxesValues(chainCell))),
        chainFirstCell: getCellAxesValues(_head(chain)),
        chainLastCell: getCellAxesValues(_last(chain)),
        removableNotesHostCells: getCellsAxesValuesListText(removableNotesHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
        firstWayToFillChainCells,
        secondWayToFillChainCells,
    }

    const rawExplainationTexts = HINT_EXPLANATION_TEXTS[HINTS_IDS.X_CHAIN]
    const explainationTextsWithPlaceholdersFilled = _map(rawExplainationTexts, (aStepRawText: string) => dynamicInterpolation(aStepRawText, placeholdersValues))
    return getHintExplanationStepsFromHintChunks(explainationTextsWithPlaceholdersFilled, false)
}

const getSvgData = (xChain: XChainRawHint) => {
    const { note, chain: chainCells } = xChain

    const result: Chain = []
    for (let i = 1; i < chainCells.length; i++) {
        const startCell = chainCells[i - 1]
        const endCell = chainCells[i]

        result.push({
            start: { cell: startCell, note },
            end: { cell: endCell, note },
            type: i % 2 === 1 ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
        })
    }

    return result
}

const getApplyHintData = (xChain: XChainRawHint) => {
    const result: NotesRemovalHintAction[] = []

    const { note, removableNotesHostCells } = xChain
    _forEach(removableNotesHostCells, (cell: Cell) => {
        result.push({
            cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: [note] },
        })
    })
    return result
}

// TODO: this is copied as it is from remotepairs
const getTryOutInputsColors = (
    chainCells: Cell[],
    cellsToFocusData: CellsFocusData,
) => {
    const result: TryOutInputsColors = {}

    _forEach(chainCells, (cell: Cell) => {
        const cellNum = convertBoardCellToNum(cell)
        const cellNotesHighlightData = cellsToFocusData[cell.row][cell.col].notesToHighlightData as NotesToHighlightData
        const highlightedNotes = _keys(cellNotesHighlightData)
        _forEach(highlightedNotes, (note: number) => {
            if (_isNil(result[cellNum])) result[cellNum] = {}
            result[cellNum][note] = cellNotesHighlightData[note].fontColor
        })
    })

    return result
}

export const transformXChainRawHint = ({ rawHint: xChain, notesData, smartHintsColorSystem }: XChainTransformerArgs): TransformedRawHint => {
    const cellsToFocusData = getUICellsToFocusData(xChain, smartHintsColorSystem)

    const { note, chain, removableNotesHostCells } = xChain
    const clickableCells = [...chain, ...removableNotesHostCells]

    // const tryOutInputsColors = getTryOutInputsColors(clickableCells, cellsToFocusData)

    const chainLinks = getSvgData(xChain)

    return ({
        type: HINTS_IDS.X_CHAIN,
        title: HINT_ID_VS_TITLES[HINTS_IDS.X_CHAIN],
        cellsToFocusData,
        focusedCells: clickableCells,
        steps: getExplainationStepsText(xChain, chainLinks),
        svgProps: { data: chainLinks },
        hasTryOut: false, // TODO:
        inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility([note]) as InputPanelNumbersVisibility,
        // tryOutAnalyserData: { xChain, tryOutInputsColors },
        tryOutAnalyserData: { xChain },
        clickableCells,
        unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',
        applyHint: getApplyHintData(xChain),
        // tryOutInputsColors,
    })
}
