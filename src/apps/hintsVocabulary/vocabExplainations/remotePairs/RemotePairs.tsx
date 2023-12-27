import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'
import _map from '@lodash/map'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { getCellAxesValues } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS, transformRemotePairsRawHint } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { getCellsAxesList, joinStringsListWithArrow } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import _head from '@lodash/head'
import _last from '@lodash/last'
import { getStyles } from './remotePairs.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'

const puzzle = '798452316603781092012030870370265048820143760060897023980014237107028050200070081'

const RemotePairs = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const rawRemotePairs = {
        remotePairNotes: [4, 5],
        orderedChainCells: [{ row: 1, col: 6 }, { row: 1, col: 1 }, { row: 2, col: 0 }, { row: 5, col: 0 }],
        removableNotesHostCells: [{ row: 5, col: 6 }],
    }

    const chainCellsAxesList = getCellsAxesList(rawRemotePairs.orderedChainCells)

    const transformedRemotePairs = transformRemotePairsRawHint({
        rawHint: rawRemotePairs,
        notesData: boardData.notes,
        mainNumbers: boardData.mainNumbers,
        smartHintsColorSystem: _get(theme, 'colors.smartHints'),
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                svgProps={transformedRemotePairs.svgProps?.data}
                showHintsSVGView
                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                    if (!show) return null
                    const { cellsToFocusData } = transformedRemotePairs
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
                    + '<b>How to make a Remote Pairs chain ?</b>'
                    + '<br/>'
                    + 'To make a Remote Pairs chain, find a cell which has only two possible candidates in it.'
                    + ' Now search for cells which make Naked Double this cell, these new cells will be added to chain.'
                    + ' Now focus on these new cells and find more cells which make Naked Double with these new cells and'
                    + ' add them to chain. Do this repeatedly until you have enough cells.'
                    + ' Look at the chain in below puzzle.'
                + '</p>'
                }
            />
        </View>
    )

    const renderChainFormationDetails = () => {
        const chainText = joinStringsListWithArrow(_map(rawRemotePairs.orderedChainCells, (chainCell: Cell) => getCellAxesValues(chainCell)))
        return (
            <SmartHintText
                text={
                    '<p>'
                        + `In above puzzle Remote Pairs chain is shown which joins cells in this order ${chainText}.`
                        + ' All of these cells have same candidates which are 4, 5 in this case.'
                        + '<br />'
                        + `<b>How are ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Links')} formed in these cells ?</b>`
                        + '<br />'
                        + `This chain is made of ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Strong Links')} and ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN_LINKS, 'Weak Links')}.`
                        + '<br />'
                        + 'Strong Link exists between the candidates of each cell in the chain. These links are not drawn in the chain due to'
                        + ' lack of space but imagine that these links are there.'
                        + '<br />'
                        + 'Weak Link exists between the candidates of two consecutive cells which make Naked Double. These'
                        + ' links are drawn with dotted lines.'
                    + '</p>'
                }
            />
        )
    }

    const renderChainEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                            + '<b>How is Remote Pairs chain useful ?</b>'
                            + '<br />'
                            + 'Cells in this chain can be filled in two ways. Let\'s try to fill it in both ways'
                            + ' and see the conclusion. But first understand the rules to fill these cells.'
                            + '<br />'
                            + '<b>Rules to fill chain cells:</b>'
                            + '<br />'
                            + '<ol>'
                                + '<li>Start with using <b>Strong</b> Link in first cell of chain</li>'
                                + `<li>Links will be used alternatively like ${joinStringsListWithArrow(['Strong', 'Weak', 'Strong'])} ...</li>`
                            + '</ol>'
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
                                + `<li>if 4 is false in ${chainCellsAxesList[0]} then 5 has to be true here. (Strong Link)</li>`
                                + `<li>since 5 is true in ${chainCellsAxesList[0]} then 5 has to be false in ${chainCellsAxesList[1]}. (Weak Link)</li>`
                                + `<li>since 5 is false in ${chainCellsAxesList[1]} then 4 has to be true in ${chainCellsAxesList[1]}. (Strong Link)</li>`
                                + `<li>since 4 is true in ${chainCellsAxesList[1]} then 4 has to be false in ${chainCellsAxesList[2]}. (Weak Link)</li>`
                                + `<li>since 4 is false in ${chainCellsAxesList[2]} then 5 has to be true in ${chainCellsAxesList[2]}. (Strong Link)</li>`
                                + `<li>since 5 is true in ${chainCellsAxesList[2]} then 5 has to be false in ${chainCellsAxesList[3]}. (Weak Link)</li>`
                                + `<li>since 5 is false in ${chainCellsAxesList[3]} then 4 has to be true in ${chainCellsAxesList[3]}. (Strong Link)</li>`
                            + '</ul>'
                        + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                            + 'Notice in the above logic, by following the rules of filling these cells we found'
                            + ` that if candidate 4 can not be filled in ${_head(chainCellsAxesList)} then it will surely be`
                            + ` filled in ${_last(chainCellsAxesList)}. It means that if ${_head(chainCellsAxesList)} is 5 then ${_last(chainCellsAxesList)} must be 4.`
                        + '</p>'
                }
            />
            <SmartHintText
                text={
                    '<p>'
                            + '<b>Second Way to fill the Chain:</b>'
                            + '<br />'
                            + 'Follow the logic with the puzzle given above.'
                            + '<br />'
                            + '<ul>'
                                + `<li>if 5 is false in ${chainCellsAxesList[0]} then 4 has to be true here. (Strong Link)</li>`
                                + `<li>since 4 is true in ${chainCellsAxesList[0]} then 4 has to be false in ${chainCellsAxesList[1]}. (Weak Link)</li>`
                                + `<li>since 4 is false in ${chainCellsAxesList[1]} then 5 has to be true in ${chainCellsAxesList[1]}. (Strong Link)</li>`
                                + `<li>since 5 is true in ${chainCellsAxesList[1]} then 5 has to be false in ${chainCellsAxesList[2]}. (Weak Link)</li>`
                                + `<li>since 5 is false in ${chainCellsAxesList[2]} then 4 has to be true in ${chainCellsAxesList[2]}. (Strong Link)</li>`
                                + `<li>since 4 is true in ${chainCellsAxesList[2]} then 4 has to be false in ${chainCellsAxesList[3]}. (Weak Link)</li>`
                                + `<li>since 4 is false in ${chainCellsAxesList[3]} then 5 has to be true in ${chainCellsAxesList[3]}. (Strong Link)</li>`
                            + '</ul>'
                        + '</p>'
                }
            />
            <SmartHintText
                text={
                    '<p>'
                            + `Notice in the second way of filling these cells if candidate 5 can not be filled in ${_head(chainCellsAxesList)} then it will surely be`
                            + ` filled in ${_last(chainCellsAxesList)}. It means that if ${_head(chainCellsAxesList)} is 4 then ${_last(chainCellsAxesList)} must be 5.`
                        + '</p>'
                }
            />
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + 'So in both of these ways, it is sure that one end of chain will be 4 and other end will be 5.'
                            + ` so any cell which is in the same ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')} as first and`
                            + ' last cells of chain can not have 4 and 5 as it\'s candidates. Hence in the example above, F7 cell'
                            + ` shares same ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')} with F1 and shares same ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')} with B7.`
                            + ' so from F7 candidate 5 can be removed.'
                            + '</p>'
                    }
                />
            </View>
        </View>
    )

    const renderValidChainLengthDetails = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                    + '<b>Note:</b> In a valid Remote Pairs chain the number of participating cells'
                    + ' must be <b>even</b> and greater than 3 like 4, 6, 8 ... Otherwise the chain\'s first'
                    + ' and last cells will be filled by same candidates and we won\'t be able to remove any candidate.'
                    + ' And a Remote Pairs chain shouldn\'t have only 2 cells because that is just a Naked Double.'
                    + '\nTry this out by yourself.'
                    + '</p>'
                }
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `Remote Pair is the simplest ${getLinkHTMLText(HINTS_VOCAB_IDS.CHAIN, 'Chain')} technique.`
                    + ` Here we build a chain of ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} which have only two ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')}`
                    + ` and all of these cells must have same candidates, kind of like ${getLinkHTMLText(HINTS_VOCAB_IDS.NAKED_DOUBLE, 'Naked Double')}.`
                    + ' So you can think of Remote Pairs as a bunch of Naked Doubles chained one after the other.'
                    + '</p>'
                }
            />
            {renderHowToMakeAChain()}
            {Example}
            {renderChainFormationDetails()}
            {renderChainEffectOnPuzzle()}
            {renderValidChainLengthDetails()}
        </View>
    )
}

export default React.memo(RemotePairs)
