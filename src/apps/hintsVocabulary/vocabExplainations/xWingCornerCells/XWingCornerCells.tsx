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

import { HOUSE_TYPE } from '@domain/board/board.constants'
import { LEG_TYPES, XWING_TYPES } from 'src/apps/arena/utils/smartHints/xWing/constants'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { LINK_TYPES } from 'src/apps/arena/utils/smartHints/chains/xChain/xChain.constants'
import { getStyles } from './xWingCornerCells.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'

const puzzle = '980062753065003000327050006790030500050009000832045009673591428249687005518020007'

const focusedCellsInExample = [
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 }),
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 4 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 0 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 4 }),
]

const XWingCornerCells = () => {
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

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `An ${getLinkHTMLText(HINTS_VOCAB_IDS.PERFECT_X_WING, 'X-Wing')} is formed using two ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'rows')} or ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'columns')}.`
                    + ' And these two rows or columns have candidate present in two cells only. so combinedly we have 4 cells where'
                    + ' the candiate is present. These 4 cells are known as X-Wing corner cells.'
                    + 'Notice 1st and 5th columns in X-Wing in below puzzle.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText text="<p>So B1, B5, E1 and E5 are X-Wing corner cells in this case.</p>" />
        </View>
    )
}

export default React.memo(XWingCornerCells)
