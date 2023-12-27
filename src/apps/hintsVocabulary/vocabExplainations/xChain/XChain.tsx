import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'

import { HINTS_VOCAB_IDS, transformXChainRawHint } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { getCellsAxesList } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getStyles } from './xChain.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'

const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'

const XChain = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const rawXChain = {
        note: 7,
        chain: [
            { row: 0, col: 1 },
            { row: 0, col: 8 },
            { row: 1, col: 7 },
            { row: 6, col: 7 },
            { row: 6, col: 2 },
            { row: 3, col: 2 },
        ],
        removableNotesHostCells: [{ row: 3, col: 1 }],
    }

    const chainCellsAxesList = getCellsAxesList(rawXChain.chain)

    const transformedXChain = transformXChainRawHint({
        rawHint: rawXChain,
        notesData: boardData.notes,
        mainNumbers: boardData.mainNumbers,
        smartHintsColorSystem: _get(theme, 'colors.smartHints'),
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                svgProps={transformedXChain.svgProps?.data}
                showHintsSVGView
                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                    if (!show) return null
                    const { cellsToFocusData } = transformedXChain
                    const noteColor = _get(cellsToFocusData, [cell.row, cell.col, 'notesToHighlightData', noteValue, 'fontColor'], null)
                    if (!noteColor) return null

                    return {
                        color: noteColor,
                        fontWeight: FONT_WEIGHTS.HEAVY,
                    }
                }}
            />
        </View>
    ) : null

    const renderHowToMakeAChain = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                    + '<b>How to make an X-Chain ?</b>'
                    + '<br/>'
                    + 'To make an X-Chain, first focus on a candidate and try to find the Strong links made by this candidate.'
                    + ' After this try to connect these Strong links using other Strong or Weak links of this candidate to make a chain of alternate'
                    + ' Strong and Weak links. See in the example above for more clarity.'
                    + '<br/>'
                    + `<b>Note:</b> A Strong link can be used as a Weak link to make a Chain. Click ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'here')} to read more on this.`
                + '</p>'
                }
            />
        </View>
    )

    const renderChainEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                        + '<b>How is X-Chain useful ?</b>'
                        + '<br />'
                        + 'Cells in this chain can be filled in two ways. Let\'s try to it in both ways'
                        + ' and see the conclusion. But first understand the rules to fill these cells.'
                    + '</p>'
                }
            />
            <SmartHintText
                text={
                    '<p>'
                        + '<b>First Way to fill the Chain:</b>'
                        + '<br />'
                        + 'Follow the logic with the puzzle given below.'
                        + '<br />'
                        + '<ul>'
                            + `<li>if 7 is false in ${chainCellsAxesList[0]} then 7 has to be true in ${chainCellsAxesList[1]}. (Strong Link)</li>`
                            + `<li>since 7 is true in ${chainCellsAxesList[1]} then 7 has to be false in ${chainCellsAxesList[2]}. (Weak Link)</li>`
                            + `<li>since 7 is false in ${chainCellsAxesList[2]} then 7 has to be true in ${chainCellsAxesList[3]}. (Strong Link)</li>`
                            + `<li>since 7 is true in ${chainCellsAxesList[3]} then 7 has to be false in ${chainCellsAxesList[4]}. (Weak Link)</li>`
                            + `<li>since 7 is false in ${chainCellsAxesList[4]} then 7 has to be true in ${chainCellsAxesList[5]}. (Strong Link)</li>`
                        + '</ul>'
                        + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                        + '<b>Second Way to fill the Chain:</b>'
                        + '<br />'
                        + 'Imagine that if all the links are reversed in the above puzzle then:'
                        + '<br />'
                        + '<ul>'
                            + `<li>if 7 is false in ${chainCellsAxesList[5]} then 7 has to be true in ${chainCellsAxesList[4]}. (Strong Link)</li>`
                            + `<li>since 7 is true in ${chainCellsAxesList[4]} then 7 has to be false in ${chainCellsAxesList[3]}. (Weak Link)</li>`
                            + `<li>since 7 is false in ${chainCellsAxesList[3]} then 7 has to be true in ${chainCellsAxesList[2]}. (Strong Link)</li>`
                            + `<li>since 7 is true in ${chainCellsAxesList[2]} then 7 has to be false in ${chainCellsAxesList[1]}. (Weak Link)</li>`
                            + `<li>since 7 is false in ${chainCellsAxesList[1]} then 7 has to be true in ${chainCellsAxesList[0]}. (Strong Link)</li>`
                        + '</ul>'
                    + '</p>'
                }
            />
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + 'So according to first way, if 7 is false in A2 then it has to be true in D3.'
                            + '<br />'
                            + 'And according to second way, if 7 is false in D3 then it has to be true in A2.'
                            + '<br />'
                            + 'So it is sure that one of A2 or D3 will be filled by 7. Because of this, all the cells'
                            + ` which are in same ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')} with first and last cells`
                            + ' of the X-Chain, can\'t have 7 as their candidate.'
                            + '<br />'
                            + 'So in the puzzle above, 7 can be removed as D2 cell\'s candidate.'
                        + '</p>'
                    }
                />
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                        + `X-Chains are the ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN, 'chains')} that are built using one ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} only.`
                        + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'Cells')} in which the candidate is present are joined in the chain using`
                        + ` alternate ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Strong')} and ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Weak')}`
                        + ' links between the candidate in focus.'
                        + '<br />'
                        + '<b>Note:</b> An X-Chain must start and end with a Strong link only. Otherwise it will not be helpful.'
                        + ' Look at the puzzle below to see an example of X-Chain and try to exercise the definition of X-Chain'
                        + ' in the puzzle given below.'
                    + '</p>'
                }
            />
            {Example}
            {renderHowToMakeAChain()}
            {renderChainEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(XChain)
