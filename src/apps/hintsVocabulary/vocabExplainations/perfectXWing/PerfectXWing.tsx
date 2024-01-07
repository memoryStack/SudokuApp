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
import { getStyles } from './perfectXWing.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'

const puzzle = '980062753065003000327050006790030500050009000832045009673591428249687005518020007'

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
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 }),
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 4 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 0 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 4 }),
]

const PerfectXWing = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()

    const boardData = useBoardData(puzzle)

    const xWing = {
        houseType: HOUSE_TYPE.COL,
        type: XWING_TYPES.PERFECT,
        legs: [
            {
                candidate: 1,
                cells: [{ row: 1, col: 0 }, { row: 4, col: 0 }],
                type: LEG_TYPES.PERFECT,
            },
            {
                candidate: 1,
                cells: [{ row: 1, col: 4 }, { row: 4, col: 4 }],
                type: LEG_TYPES.PERFECT,
            },
        ],
    }

    const transformedXWing = transformXWingRawHint({
        rawHint: xWing,
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

    const renderXWingEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                            + '<b>How is X-Wing useful ?</b>'
                            + '<br />'
                            + 'In below puzzle, to fill 1 in 1st and 5th columns, there are two ways. Let\'s try both of these'
                            + ' ways and see the conclusion.'
                            + '<br />'
                            + '<b>First way</b>'
                            + '<br />'
                            + 'In 1st column if 1 will be filled in B1 cell then 1 can\'t be filled in E1 and B5 cells, hence in 5th column'
                            + ' 1 can be filled only in E5.'
                        + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                            + '<b>Second way</b>'
                            + '<br />'
                            + 'In 1st column if 1 will be filled in E1 cell then 1 can\'t be filled in B1 and E5 cells, hence in 5th column'
                            + ' 1 can be filled only in B5.'
                        + '</p>'
                }
            />
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        '<p>'
                            + 'There are no other ways to fill 1 in these two columns. So 1 will come in either B1 and E5 cells or in E1 and B5 cells.'
                            + 'Hence in row B and E, 1 can be eliminated as candidate from all the cells where it is highlighted in red color.'
                        + '</p>'
                    }
                />
            </View>
        </View>
    )

    const renderXWingInRowHouse = () => {
        const xWingInRow = {
            houseType: HOUSE_TYPE.ROW,
            type: XWING_TYPES.PERFECT,
            legs: [
                {
                    candidate: 3,
                    cells: [{ row: 4, col: 6 }, { row: 4, col: 7 }],
                    type: LEG_TYPES.PERFECT,
                },
                {
                    candidate: 3,
                    cells: [{ row: 7, col: 6 }, { row: 7, col: 7 }],
                    type: LEG_TYPES.PERFECT,
                },
            ],
        }

        const focusedCellsInExample = [
            ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 4 }),
            ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 7 }),
            ...getHouseCells({ type: HOUSE_TYPE.COL, num: 6 }),
            ...getHouseCells({ type: HOUSE_TYPE.COL, num: 7 }),
        ]
        const transformedXWing = transformXWingRawHint({
            rawHint: xWingInRow,
            notesData: boardData.notes,
            mainNumbers: boardData.mainNumbers,
            smartHintsColorSystem: _get(theme, 'colors.smartHints'),
        })

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

        return (
            <View style={{ marginTop: 12 }}>
                <SmartHintText
                    text={
                        '<p>'
                        + '<b>X-Wing in Rows</b>'
                        + '<br />'
                        + 'In above X-Wing examples, the candidate was present two times in two columns. So when candiate is present two times in two rows'
                        + ' then X-Wing will look like below example'
                        + '</p>'
                    }
                />
                {boardExample}
                <SmartHintText
                    text={
                        '<p>'
                        + 'Here candidate 3 is present two times in E and H rows, and candidate 3 will be removed from columns 7th and 8th'
                        + ' cells where it is highlighted in red color.'
                        + '</p>'
                    }
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                        + `In X-Wing, we focus on a single ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} in ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'rows')} and ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'columns')}.`
                        + ' An X-Wing is formed when a candidate is present only twice in two rows or columns such that both of these rows or columns have that candidate'
                        + ' in same positions.'
                        + '<br />'
                        + 'Notice an X-Wing in below puzzle.'
                    + '</p>'
                }
            />
            {Example}
            {explainXWingFormationInExample()}
            {explainInvalidXWing()}
            {renderXWingEffectOnPuzzle()}
            {renderXWingInRowHouse()}
        </View>
    )
}

export default React.memo(PerfectXWing)
