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
import { getXWingCells } from 'src/apps/arena/utils/smartHints/xWing/utils'
import { isCellExists } from 'src/apps/arena/utils/util'
import { getHouseCells } from 'src/apps/arena/utils/houseCells'
import { LINK_TYPES } from 'src/apps/arena/utils/smartHints/chains/xChain/xChain.constants'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { getStyles } from './finnedXWing.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'

const puzzle = '500000000002009010730004000106008090020793050090100408000200073060900800000000001'

const faultyXWingWithMoreThanTwoCrossHouses = {
    houseType: HOUSE_TYPE.ROW,
    type: XWING_TYPES.PERFECT,
    legs: [
        {
            candidate: 2,
            cells: [{ row: 1, col: 6 }, { row: 1, col: 8 }],
            type: LEG_TYPES.PERFECT,
        },
        {
            candidate: 2,
            cells: [{ row: 3, col: 3 }, { row: 3, col: 8 }],
            type: LEG_TYPES.PERFECT,
        },
    ],
}

const focusedCellsInExample = [
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 0 }),
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 6 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 1 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 5 }),
    ...getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 7 }),
]

const FinnedXWing = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const finnedXWing = {
        houseType: HOUSE_TYPE.COL,
        type: XWING_TYPES.FINNED,
        legs: [
            {
                candidate: 1,
                cells: [{ row: 0, col: 1 }, { row: 6, col: 1 }],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 1,
                cells: [{ row: 0, col: 5 }, { row: 6, col: 5 }, { row: 7, col: 5 }],
                type: LEG_TYPES.FINNED,
            },
        ],
    }

    const transformedXWing = transformXWingRawHint({
        rawHint: finnedXWing,
        notesData: boardData.notes,
        mainNumbers: boardData.mainNumbers,
        smartHintsColorSystem: _get(theme, 'colors.smartHints'),
    })

    const XWingCrossConfigs = [
        {
            start: { cell: { row: 1, col: 0 }, note: 1 },
            end: { cell: { row: 4, col: 4 }, note: 1 },
            type: LINK_TYPES.STRONG,
        },
        {
            start: { cell: { row: 4, col: 0 }, note: 1 },
            end: { cell: { row: 1, col: 4 }, note: 1 },
            type: LINK_TYPES.STRONG,
        },
    ]

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...getTrimmedBoardData(boardData, focusedCellsInExample, { trimNotes: true })}
                showCellContent
                showHintsSVGView
                svgProps={XWingCrossConfigs}
                hideSVGDrawingsMarkersEnd
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

    const explainXWingFormationInExample = () => (
        <SmartHintText
            text={
                '<p>'
                + 'In above puzzle, both columns 1st and 5th have 1 as candidate in their 2nd and 5th cells and these 4 cells where 1 is present make'
                + ' an <b>X</b> letter shape.'
                + '</p>'
            }
        />
    )

    const explainInvalidXWing = () => {
        const focusedCellsInExample = [
            ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 }),
            ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 3 }),
            ...getHouseCells({ type: HOUSE_TYPE.COL, num: 3 }),
            ...getHouseCells({ type: HOUSE_TYPE.COL, num: 6 }),
            ...getHouseCells({ type: HOUSE_TYPE.COL, num: 8 }),
        ]
        const transformedXWing = transformXWingRawHint({
            rawHint: faultyXWingWithMoreThanTwoCrossHouses,
            notesData: boardData.notes,
            mainNumbers: boardData.mainNumbers,
            smartHintsColorSystem: _get(theme, 'colors.smartHints'),
        })
        const xWingCells = getXWingCells(faultyXWingWithMoreThanTwoCrossHouses.legs)
        const boardExample = !_isNil(boardData.mainNumbers) ? (
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
                        if (!show || !isCellExists(cell, xWingCells)) return null
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

        return (
            <View style={{ marginTop: 12 }}>
                <SmartHintText text="<p><b>Invalid X-Wing example</b></p>" />
                {boardExample}
                <SmartHintText
                    text={
                        '<p>'
                        + 'Notice in above puzzle, in both rows B and D candidate 2 is present only two times'
                        + ' but cells positions are not same in these rows.'
                        + '<br />'
                        + ' In row B, it\'s in 7th and 9th cell and in row D'
                        + ' it\'s in 4th and 9th cell. Hence it\'s not a valid X-Wing.'
                        + '</p>'
                    }
                />
            </View>
        )
    }

    const renderFinnCellsLocationDetails = () => (
        <>
            <SmartHintText text="<p><b>Location of Finn Cells for a valid Finned X-Wing</b></p>" />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                                + '<ul>'
                                    + '<li>Only one row or column can have Finn Cells</li>'
                                    // TODO: add X-Wing corner cells info in X-Wing hint
                                    + `<li>Finn Cells must be in same ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')} as one of the 4 ${getLinkHTMLText(HINTS_VOCAB_IDS.PERFECT_X_WING, 'X-Wing')} corner cells</li>`
                                + '</ul>'
                            + '</p>'
                    }
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + 'Now notice that in above puzzle, these two conditions are satisfied.'
                            + '</p>'
                    }
                />
                <View style={{ marginLeft: 8 }}>
                    <SmartHintText
                        text={
                            '<p>'
                                + '<ul>'
                                    + '<li>out of 2nd and 6th columns only 6th column have Finn Cells</li>'
                                    + '<li>H6 Finn Cell is in same block as G6 X-Wing corner cell</li>'
                                + '</ul>'
                            + '</p>'
                        }
                    />
                </View>
            </View>
        </>
    )

    const renderInvalidFinnCellsPatterns = () => {
        if (_isNil(boardData.mainNumbers)) return null

        const firstInvalidXWing = {
            houseType: HOUSE_TYPE.ROW,
            type: XWING_TYPES.FINNED,
            legs: [
                {
                    candidate: 8,
                    cells: [{ row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 7 }],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 8,
                    cells: [{ row: 5, col: 2 }, { row: 5, col: 7 }],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        const secondInvalidXWing = {
            houseType: HOUSE_TYPE.ROW,
            type: XWING_TYPES.FINNED,
            legs: [
                {
                    candidate: 5,
                    cells: [{ row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 6 }, { row: 1, col: 8 }],
                    type: LEG_TYPES.FINNED,
                },
                {
                    candidate: 5,
                    cells: [{ row: 7, col: 3 }, { row: 7, col: 8 }],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        const exampleOneTransformedXWing = transformXWingRawHint({
            rawHint: firstInvalidXWing,
            notesData: boardData.notes,
            mainNumbers: boardData.mainNumbers,
            smartHintsColorSystem: _get(theme, 'colors.smartHints'),
        })

        const exampleTwoTransformedXWing = transformXWingRawHint({
            rawHint: secondInvalidXWing,
            notesData: boardData.notes,
            mainNumbers: boardData.mainNumbers,
            smartHintsColorSystem: _get(theme, 'colors.smartHints'),
        })

        const firstExampleFocusedCells = getHouseCells({ type: HOUSE_TYPE.ROW, num: 2 })
        const secondExampleFocusedCells = getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 })

        const renderTruncatedRow = (transformedXWing, focusedCells, zoomableViewConfig) => {
            const a = 1
            return (
                <View style={[{ height: 80 }, styles.exampleBoardContainer]}>
                    <ReactNativeZoomableView
                        zoomEnabled={false}
                        {...zoomableViewConfig}
                        disableShifting
                    >
                        <Board
                            {...getTrimmedBoardData(boardData, focusedCells)}
                            showCellContent
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
                    </ReactNativeZoomableView>
                </View>
            )
        }

        return (
            <View style={{ marginTop: 8, width: '100%' }}>
                <SmartHintText text="<p><b>Some examples of Finn Cells which do not follow above conditions</b></p>" />
                {renderTruncatedRow(exampleOneTransformedXWing, firstExampleFocusedCells, { initialOffsetY: 90 })}
                <SmartHintText
                    text={
                        '<p>'
                            + 'Here 4th and 5th cells are Finn Cells in row C, but these are not in same block'
                            + ' with X-Wing corner cells. It violates 2nd condition mentioned above.'
                        + '</p>'
                    }
                />
                {renderTruncatedRow(exampleTwoTransformedXWing, secondExampleFocusedCells, { initialOffsetY: 135 })}
                <SmartHintText
                    text={
                        '<p>'
                            + 'Here 5th and 7th cells are Finn Cells in row B, but these are in same block with'
                            + ' both of X-Wing corner cells. It too violates 2nd condition mentioned above.'
                        + '</p>'
                    }
                />
            </View>
        )
    }

    const renderTechniqueEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                        + '<b>How is Finned X-Wing useful ?</b>'
                        + '<br />'
                        + 'In below puzzle, if it was a proper X-Wing then we could have removed all candidate 1 from'
                        + ' row A and G except 4 corner cells. But due to Finn Cell in 6th column, now we would be able to remove'
                        + ' candidate 1 from only G5. Read below to understand the reasoning behind it.'
                        + '<br />'
                        + 'To fill 1 in 2nd and 6th columns, there are two ways. Let\'s try both of these'
                        + ' ways and see the conclusion.'
                        + '<br />'
                        + '<b>First way</b>'
                        + '<br />'
                        + 'If we fill 1 in A2 cell of 2nd column then 1 can\'t be filled in G2 and A6 cells, hence in 6th column'
                        + ' 1 will be filled in G6 or H6 cells. And it would look like below'
                        + '<br />'
                        + 'Case 1: 1 is filled in A2 and G6'
                    + '</p>'
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row A, 1 will be removed from A3, A5</li>'
                                + '<li>in row G, 1 will be removed from G3, G5</li>'
                            + '</ul>'
                        + '</p>'
                    }
                />
            </View>
            <SmartHintText text="<p>Case 2: 1 is filled in A2 and H6</p>" />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row A, 1 will be removed from A3, A5</li>'
                                + '<li>in row G, 1 will be removed from G5 only</li>'
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
                        + 'If we fill 1 in G2 cell of 2nd column then 1 can\'t be filled in A2 and G6 cells, hence in 6th column'
                        + ' 1 will be filled in A6 or H6 cells. And it would look like below'
                        + '<br />'
                        + 'Case 1: 1 is filled in G2 and A6'
                    + '</p>'
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row A, 1 will be removed from A3, A5</li>'
                                + '<li>in row G, 1 will be removed from G3, G5</li>'
                            + '</ul>'
                        + '</p>'
                    }
                />
            </View>
            <SmartHintText text="<p>Case 2: 1 is filled in G2 and H6</p>" />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + '<ul>'
                                + '<li>in row A, 1 <b>can\'t</b> be removed from A3 or A5 now</li>'
                                + '<li>in row G, 1 will be removed from G3, G5</li>'
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
                            + 'There are no other ways to fill 1 in these two columns. And notice carefully that in all such cases'
                            + ' G5 is the only cell where 1 can\'t come. In the other cells like A3, A5, G3 candidate 1 can\'t be removed'
                            + ' in all the cases of filling 2nd and 6th columns with 1.'
                            + '<br />'
                            + 'So at this point we can remove 1 from G5 only.'
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
                    + `Before learning this technique, you should be comfortable in understanding ${getLinkHTMLText(HINTS_VOCAB_IDS.PERFECT_X_WING, 'X-Wing')} technique.`
                    + '<br />'
                    + `Now the difference between X-Wing and Finned X-Wing is that in one of the ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')} or ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')}`
                    + ` the ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} on which we are focusing on, can be present more than two times.`
                    + ' And in some cases we can still remove the candidate from some cells.'
                    + '<br />'
                    + 'Notice Finned X-Wing example in below puzzle. Here if candidate 1 was not present in H6 cell of 6th column then it would have been a perfect'
                    + ' X-Wing. So these extra cells where the candidates are present in row or column are called <b>Finn Cells</b>. And it\'s highlighted in purple color.'
                    + '</p>'
                }
            />
            {Example}
            {renderFinnCellsLocationDetails()}
            {renderInvalidFinnCellsPatterns()}
            {renderTechniqueEffectOnPuzzle()}
            {/* {Example}
            {explainXWingFormationInExample()}
            {explainInvalidXWing()}
            {renderXWingEffectOnPuzzle()}
            {renderXWingInRowHouse()} */}
        </View>
    )
}

export default React.memo(FinnedXWing)
