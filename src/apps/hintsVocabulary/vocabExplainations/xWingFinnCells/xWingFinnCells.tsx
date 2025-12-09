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
import { getStyles } from './xWingFinnCells.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
const puzzle = '500000000002009010730004000106008090020793050090100408000200073060900800000000001'

const focusedCellsInExample = [
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 0 }),
    ...getHouseCells({ type: HOUSE_TYPE.ROW, num: 6 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 1 }),
    ...getHouseCells({ type: HOUSE_TYPE.COL, num: 5 }),
    ...getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 7 }),
]

const XWingFinnCells = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'xWingFinnCells',
    })
    const boardData = useBoardData(puzzle)

    const finnedXWing = {
        isComposite: false,
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

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    t('intro')
                }
            />
            {Example}
            <SmartHintText
                text={
                    t('observation')
                }
            />
        </View>
    )
}

export default React.memo(XWingFinnCells)
