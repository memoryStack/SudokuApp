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
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const puzzle = '304520080006090000050070300000689023000734000063152700010960000009040060608217005'

const XChain = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'xChain',
    })
    const boardData = useBoardData(puzzle)

    const rawXChain = {
        isComposite: false,
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
                    t('howToMake.explanation')
                }
            />
        </View>
    )

    const renderChainEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    t('effect.intro')
                }
            />
            <SmartHintText
                text={
                    t('effect.firstWay', {
                        chainCell0: chainCellsAxesList[0],
                        chainCell1: chainCellsAxesList[1],
                        chainCell2: chainCellsAxesList[2],
                        chainCell3: chainCellsAxesList[3],
                        chainCell4: chainCellsAxesList[4],
                        chainCell5: chainCellsAxesList[5],
                    })
                }
            />
            {Example}
            <SmartHintText
                text={
                    t('effect.secondWay', {
                        chainCell0: chainCellsAxesList[0],
                        chainCell1: chainCellsAxesList[1],
                        chainCell2: chainCellsAxesList[2],
                        chainCell3: chainCellsAxesList[3],
                        chainCell4: chainCellsAxesList[4],
                        chainCell5: chainCellsAxesList[5],
                    })
                }
            />
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
            {renderHowToMakeAChain()}
            {renderChainEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(XChain)
