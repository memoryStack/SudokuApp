import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'

import { HINTS_VOCAB_IDS, transformXYChainRawHint } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { getCellsAxesList, joinStringsListWithArrow } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getStyles } from './xyChain.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'

const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'

const XYChain = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const rawXYChain = {
        note: 3,
        chain: [
            { row: 6, col: 3 },
            { row: 4, col: 3 },
            { row: 4, col: 5 },
            { row: 1, col: 5 },
        ],
        removableNotesHostCells: [{ row: 1, col: 3 }, { row: 2, col: 3 }, { row: 6, col: 5 }],
    }

    const chainCellsAxesList = getCellsAxesList(rawXYChain.chain)

    const transformedXYChain = transformXYChainRawHint({
        rawHint: rawXYChain,
        notesData: boardData.notes,
        mainNumbers: boardData.mainNumbers,
        smartHintsColorSystem: _get(theme, 'colors.smartHints'),
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                svgProps={transformedXYChain.svgProps?.data}
                showHintsSVGView
                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                    if (!show) return null
                    const { cellsToFocusData } = transformedXYChain
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

    const renderXYChainExampleLinksDetails = () => (
        <>
            <SmartHintText
                text={
                    '<p>'
                    + `XY-Chain is made of alternate ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Strong')} and ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Weak')}`
                    + ' links and it must start and end with a Strong Link.'
                    + '<br />'
                    + `Here in the example above, in chain ${joinStringsListWithArrow(chainCellsAxesList)} imagine that each of these cells has a Strong link`
                    + ' between it\'s candidates. These Strong links are not shown due to lack of space. So, this chain can be read like a sequence of below links'

                    + '</p>'
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                                + '<ul>'
                                    + '<li><b>Strong</b> Link between candidate 3 and candidate 9 in G4</li>'
                                    + '<li><b>Weak</b> Link between candidate 9 of G4 and candidate 9 of E4</li>'
                                    + '<li><b>Strong</b> Link between candidate 9 and candidate 8 in E4</li>'
                                    + '<li><b>Weak</b> Link between candidate 8 of E4 and candidate 8 of E6</li>'
                                    + '<li><b>Strong</b> Link between candidate 8 and candidate 2 in E6</li>'
                                    + '<li><b>Weak</b> Link between candidate 2 of E6 and candidate 2 of B6</li>'
                                    + '<li><b>Strong</b> Link between candidate 2 and candidate 3 in B6</li>'
                                + '</ul>'
                            + '</p>'
                    }
                />
            </View>
        </>
    )

    const renderChainEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                        + '<b>How is XY-Chain useful ?</b>'
                        + '<br />'
                        + 'This XY-Chain starts from G4 and ends in B6. Both of these cells have 3 as their candidate.'
                        + ' Let\'s take G4 and try to fill this chain with an assumption that what if 3 can not be the solution for G4 cell.'
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
                            + `<li>if 3 is false in ${chainCellsAxesList[0]} then 9 has to be true in ${chainCellsAxesList[0]}. (Strong Link)</li>`
                            + `<li>since 9 is true in ${chainCellsAxesList[0]} then 9 has to be false in ${chainCellsAxesList[1]}. (Weak Link)</li>`
                            + `<li>since 9 is false in ${chainCellsAxesList[1]} then 8 has to be true in ${chainCellsAxesList[1]}. (Strong Link)</li>`
                            + `<li>since 8 is true in ${chainCellsAxesList[1]} then 8 has to be false in ${chainCellsAxesList[2]}. (Weak Link)</li>`
                            + `<li>since 8 is false in ${chainCellsAxesList[2]} then 2 has to be true in ${chainCellsAxesList[2]}. (Strong Link)</li>`
                            + `<li>since 2 is true in ${chainCellsAxesList[2]} then 2 has to be false in ${chainCellsAxesList[3]}. (Weak Link)</li>`
                            + `<li>since 2 is false in ${chainCellsAxesList[3]} then 3 has to be true in ${chainCellsAxesList[3]}. (Strong Link)</li>`
                        + '</ul>'
                        + `So according to this, if 3 is false in ${chainCellsAxesList[0]} then it has to be true in ${chainCellsAxesList[3]}`
                        + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                        + 'Now let\'s take B6 and try to fill this chain with an assumption that what if 3 can not be the solution for B6 cell.'
                        + '<br />'
                        + '<b>Second Way to fill the Chain:</b>'
                        + '<br />'
                        + 'Imagine that if all the links are reversed in the above puzzle then:'
                        + '<br />'
                        + '<ul>'
                            + `<li>if 3 is false in ${chainCellsAxesList[3]} then 2 has to be true in ${chainCellsAxesList[3]}. (Strong Link)</li>`
                            + `<li>since 2 is true in ${chainCellsAxesList[3]} then 2 has to be false in ${chainCellsAxesList[2]}. (Weak Link)</li>`
                            + `<li>since 2 is false in ${chainCellsAxesList[2]} then 8 has to be true in ${chainCellsAxesList[2]}. (Strong Link)</li>`
                            + `<li>since 8 is true in ${chainCellsAxesList[2]} then 8 has to be false in ${chainCellsAxesList[1]}. (Weak Link)</li>`
                            + `<li>since 8 is false in ${chainCellsAxesList[1]} then 9 has to be true in ${chainCellsAxesList[1]}. (Strong Link)</li>`
                            + `<li>since 9 is true in ${chainCellsAxesList[1]} then 9 has to be false in ${chainCellsAxesList[0]}. (Weak Link)</li>`
                            + `<li>since 9 is false in ${chainCellsAxesList[0]} then 3 has to be true in ${chainCellsAxesList[0]}. (Strong Link)</li>`
                        + '</ul>'
                        + '<br />'
                        + `So according to this, if 3 is false in ${chainCellsAxesList[3]} then it has to be true in ${chainCellsAxesList[0]}`
                    + '</p>'
                }
            />
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + 'So it is sure that either <b>First</b> or <b>Last</b> cell will be filled by 3. Because of this, all the cells'
                            + ` which are in same ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')} with first and last cells`
                            + ' of the XY-Chain, can\'t have 3 as their candidate.'
                            + '<br />'
                            + 'So in the puzzle above, 7 can be removed as candidate from B3, C3 and G6 cells.'
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
                        + `XY-Chain is the ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN, 'chain')} that is built using ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')}`
                        + ` which have only two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} (similar to ${getLinkHTMLText(HINTS_VOCAB_IDS.REMOTE_PAIRS, 'Remote Pairs')}) in them`
                        + ' but unlike Remote Pairs in XY-Chain any two cells in the chain can have different candidates.'
                        + '<br />'
                        + '<b>Note:</b> Any two consecutive cells in the chain must have atleast one candidate common and <b>First</b>'
                        + ' and <b>Last</b> cells also must have atleast one candidate common.'
                        + '<br />'
                        + 'Notice an XY-Chain in below puzzle.'
                    + '</p>'
                }
            />
            {Example}
            {renderXYChainExampleLinksDetails()}
            {renderChainEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(XYChain)
