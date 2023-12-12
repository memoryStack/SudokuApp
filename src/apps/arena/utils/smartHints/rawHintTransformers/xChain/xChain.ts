import _map from '@lodash/map'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import _forEach from '@lodash/forEach'

import {
    TransformedRawHint,
    SmartHintsColorSystem,
    CellsFocusData,
    Chain,
    NotesToHighlightData,
} from '../../types'
import { XChainTransformerArgs } from './types'
import { HINTS_IDS } from '../../constants'
import { HINT_EXPLANATION_TEXTS, HINT_ID_VS_TITLES } from '../../stringLiterals'
import { XChainRawHint } from '../../xChain/types'
import { BoardIterators } from '../../../classes/boardIterators'
import {
    getHintExplanationStepsFromHintChunks,
    setCellDataInHintResult,
    transformCellBGColor,
    setCellNotesHighlightDataInHintResult,
} from '../../util'
import smartHintColorSystemReader from '../../colorSystem.reader'
import { LINK_TYPES } from '../../xChain/xChain.constants'

// XChainTransformerArgs

// TODO: add multiple colors for chain cells notes
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

    _forEach(chainCells, (cell: Cell) => {
        const notesHighlightData: NotesToHighlightData = {}
        notesHighlightData[note] = { fontColor: 'green' }
        setCellNotesHighlightDataInHintResult(cell, notesHighlightData, result)
    })

    return result
}

const getExplainationStepsText = (xChain: XChainRawHint, notes: Notes) => {
    const rawExplainationTexts = HINT_EXPLANATION_TEXTS[HINTS_IDS.REMOTE_PAIRS]
    const placeholdersValues = {}
    const explainationTextsWithPlaceholdersFilled = _map(rawExplainationTexts, (aStepRawText: string) => dynamicInterpolation(aStepRawText, placeholdersValues))
    return getHintExplanationStepsFromHintChunks(explainationTextsWithPlaceholdersFilled)
}

// TODO: add "link type" field in Chain types
// TODO: let's change the contract of these links for svg data
// send proper links, not chains array
const getSvgData = (xChain: XChainRawHint): Chain => {
    const { note, chain: chainCells } = xChain
    return _map(chainCells, (chainCell: Cell, indx: number) => {
        if (indx === 0) {
            return {
                cell: chainCell,
                out: note,
                type: LINK_TYPES.STRONG,
            }
        }
        if (indx === chainCells.length - 1) {
            return {
                cell: chainCell,
                in: note,
            }
        }
        return {
            cell: chainCell,
            in: note,
            out: note,
            type: indx % 2 === 0 ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
        }
    })
}

export const transformXChainRawHint = ({ rawHint: xChain, notesData, smartHintsColorSystem }: XChainTransformerArgs): TransformedRawHint => {
    // const { orderedChainCells, removableNotesHostCells } = remotePairs
    // const clickableCells = [...orderedChainCells, ...removableNotesHostCells]
    const cellsToFocusData = getUICellsToFocusData(xChain, smartHintsColorSystem)

    // const tryOutInputsColors = getTryOutInputsColors(clickableCells, cellsToFocusData)

    return ({
        type: HINTS_IDS.X_CHAIN,
        title: HINT_ID_VS_TITLES[HINTS_IDS.X_CHAIN],
        cellsToFocusData,
        // focusedCells: clickableCells,
        steps: getExplainationStepsText(xChain, notesData),
        svgProps: { data: getSvgData(xChain) },
        // hasTryOut: true,
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(remotePairs.remotePairNotes) as InputPanelNumbersVisibility,
        // tryOutAnalyserData: { remotePairs, tryOutInputsColors },
        // clickableCells,
        // unclickableCellClickInTryOutMsg: 'you can only select Chain cells or cells which have candidates highlighted in red color',
        // applyHint: getApplyHintData(remotePairs, notesData),
        // tryOutInputsColors,
    })
}
