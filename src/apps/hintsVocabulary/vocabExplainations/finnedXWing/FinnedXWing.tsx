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
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { getStyles } from './finnedXWing.styles'
import { useBoardData } from '../hooks/useBoardData'
import { useSmartHintsTranslations } from '../hooks/useSmartHintsTranslations'
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'
import { TransformedRawHint } from 'src/apps/arena/utils/smartHints/types'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const puzzle = '500000000002009010730004000106008090020793050090100408000200073060900800000000001'

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
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'finnedXWing',
    })
    const boardData = useBoardData(puzzle)
    const smartHintsTranslationsTexts = useSmartHintsTranslations()

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
        smartHintsTranslationsTexts,
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

    const renderFinnCellsLocationDetails = () => (
        <>
            <SmartHintText text={t('finnCellsLocation.title')} />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('finnCellsLocation.rules')
                    }
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        t('finnCellsLocation.observation')
                    }
                />
                <View style={{ marginLeft: 8 }}>
                    <SmartHintText
                        text={
                            t('finnCellsLocation.examples')
                        }
                    />
                </View>
            </View>
        </>
    )

    const renderInvalidFinnCellsPatterns = () => {
        if (_isNil(boardData.mainNumbers)) return null

        const firstInvalidXWing = {
            isComposite: false,
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
            isComposite: false,
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
            smartHintsTranslationsTexts,
        })

        const exampleTwoTransformedXWing = transformXWingRawHint({
            rawHint: secondInvalidXWing,
            notesData: boardData.notes,
            mainNumbers: boardData.mainNumbers,
            smartHintsColorSystem: _get(theme, 'colors.smartHints'),
            smartHintsTranslationsTexts,
        })

        const firstExampleFocusedCells = getHouseCells({ type: HOUSE_TYPE.ROW, num: 2 })
        const secondExampleFocusedCells = getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 })

        const renderTruncatedRow = (transformedXWing: TransformedRawHint, focusedCells: Cell[], zoomableViewConfig: { initialOffsetY: number }) => {
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
                <SmartHintText text={t('invalidPatterns.title')} />
                {renderTruncatedRow(exampleOneTransformedXWing, firstExampleFocusedCells, { initialOffsetY: 90 })}
                <SmartHintText
                    text={
                        t('invalidPatterns.example1')
                    }
                />
                {renderTruncatedRow(exampleTwoTransformedXWing, secondExampleFocusedCells, { initialOffsetY: 135 })}
                <SmartHintText
                    text={
                        t('invalidPatterns.example2')
                    }
                />
            </View>
        )
    }

    const renderTechniqueEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    t('effect.intro')
                }
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
                        t('effect.secondWayCase1')
                    }
                />
            </View>
            <SmartHintText text={t('effect.secondWayCase2Title')} />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('effect.secondWayCase2')
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
            {renderFinnCellsLocationDetails()}
            {renderInvalidFinnCellsPatterns()}
            {renderTechniqueEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(FinnedXWing)
