import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'

import { HINTS_VOCAB_IDS, transformXWingRawHint } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { HOUSE_TYPE } from 'src/apps/arena/utils/smartHints/constants'
import { LEG_TYPES, XWING_TYPES } from 'src/apps/arena/utils/smartHints/xWing/constants'
import { getHouseCells } from 'src/apps/arena/utils/houseCells'
import { getStyles } from './sashimiFinnedXWing.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'

const puzzle = '100000420008904053009053000010006204300090007204500080000870900870209600042000005'

const focusedCellsInExample = [
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 5 }),
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 8 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 3 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 6 }),
    ...getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 4 }),
]

const FinnedXWing = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const finnedXWing = {
        houseType: HOUSE_TYPE.COL,
        type: XWING_TYPES.SASHIMI_FINNED,
        legs: [
            {
                candidate: 3,
                cells: [{ row: 3, col: 3 }, { row: 5, col: 3 }, { row: 8, col: 3 }],
                type: LEG_TYPES.SASHIMI_FINNED,
            },
            {
                candidate: 1,
                cells: [{ row: 5, col: 6 }, { row: 8, col: 6 }],
                type: LEG_TYPES.PERFECT,
            },
        ],
    }

    const transformedXWing = transformXWingRawHint({
        rawHint: finnedXWing,
        notesData: boardData.notes,
        mainNumbers: boardData.mainNumbers,
        smartHintsColorSystem: _get(theme, 'colors.smartHints'),
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...getTrimmedBoardData(boardData, focusedCellsInExample, { trimNotes: true })}
                showCellContent
                showHintsSVGView
                getCellBGColor={(cell: Cell) => {
                    const { cellsToFocusData } = transformedXWing
                    return _get(cellsToFocusData, [cell.row, cell.col, 'bgColor'], styles.smartHintOutOfFocusBGColor)
                }}
                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                    if (!show) return null
                    const { cellsToFocusData } = transformedXWing
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

    const renderTechniqueEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                        + '<b>How is Sashimi Finned X-Wing useful ?</b>'
                        + '<br />'
                        + 'Here in below puzzle we will follow the same logic as we did in Finned X-Wing to draw our conclusion.'
                        + '<br />'
                        + 'So in below puzzle to fill 3 in 4th and 7th columns, there are two ways. Let\'s try both of these'
                        + ' ways and see the conclusion.'
                        + '<br />'
                        + '<b>First way</b>'
                        + '<br />'
                        + 'If we fill 3 in F7 cell of 7th column then 3 can\'t be filled in I7 cell, hence in 4th column'
                        + ' 3 will be filled in one of D4 and I4. And it would look like below'
                        + '<br />'
                        + 'Case 1: 3 is filled in F7 and D4'
                    + '</p>'
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row F, 3 will be removed from F5</li>'
                                + '<li>in row I, 3 will <b>not</b> be removed from I5</li>'
                            + '</ul>'
                        + '</p>'
                    }
                />
            </View>
            <SmartHintText text="<p>Case 2: 3 is filled in F7 and I4</p>" />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row F, 3 will be removed from F5</li>'
                                + '<li>in row I, 3 will be removed from I5</li>'
                            + '</ul>'
                        + '</p>'
                    }
                />
            </View>
            {Example}
            <SmartHintText
                text={
                    '<p>'
                        + '<b>Second way</b>'
                        + '<br />'
                        + 'If we fill 3 in I7 cell of 7th column then 3 can\'t be filled in I4 and F7 cells, hence in 4th column'
                        + ' 3 will be filled in D4 only. And it would look like below'
                    + '</p>'
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row F, 3 will be removed from F5</li>'
                                + '<li>in row I, 3 will be removed from I5</li>'
                            + '</ul>'
                        + '</p>'
                    }
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<b>Conclusion</b>'
                            + '<br />'
                            + 'There are no other ways to fill 3 in these two columns. And notice carefully that in all such cases'
                            + ' F5 is the only cell where 3 can\'t come. In the I5 candidate 3 can\'t be removed'
                            + ' in all the cases of filling 4th and 7th columns with 3.'
                            + ' So at this point we can remove 3 from F5 only.'
                            + '<br />'
                            + '<br />'
                            + 'Hence, in general in Sashimi Finned X-Wing candidate will be removed from cells which share'
                            + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')} with Finn Cells.`
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
                    + `Before learning this technique, you should be comfortable in understanding ${getLinkHTMLText(HINTS_VOCAB_IDS.FINNED_X_WING, 'Finned X-Wing')} technique.`
                    + '<br />'
                    + `Now the difference between Finned X-Wing and Sashimi Finned X-Wing is that in one of the ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'rows')} or ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'columns')}`
                    + ` the ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} on which we are focusing on, will not be present in one of the X-Wing ${getLinkHTMLText(HINTS_VOCAB_IDS.X_WING_CORNER_CELLS, 'corner')} cells.`
                    + 'Notice Sashimi Finned X-Wing example in below puzzle. Here candidate 3 is not present in F4 cell of 4th column.'
                    + ' If 3 was present here then it would have been Finned X-Wing but it will be called as Sashimi Finned X-Wing and D4 is the Finn Cell here.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + '<b>Note:</b> Only one row or column is allowed to have a missing candidate.'
                    + '</p>'
                }
            />
            {renderTechniqueEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(FinnedXWing)
