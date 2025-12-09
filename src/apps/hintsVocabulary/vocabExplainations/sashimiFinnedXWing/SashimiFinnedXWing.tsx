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
import { getStyles } from './sashimiFinnedXWing.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

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
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'sashimiFinnedXWing',
    })
    const boardData = useBoardData(puzzle)

    const finnedXWing = {
        isComposite: false,
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
                text={t('effect.intro')}
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('effect.firstWayCase1')
                    }
                />
            </View>
            <SmartHintText text={t('effect.firstWayCase2Title')} />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('effect.firstWayCase2')
                    }
                />
            </View>
            {Example}
            <SmartHintText
                text={
                    t('effect.secondWayIntro')
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('effect.secondWayResult')
                    }
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        t('effect.conclusion')
                    }
                />
            </View>
        </View>
    )

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
                    t('note')
                }
            />
            {renderTechniqueEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(FinnedXWing)
