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
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const puzzle = '361749528584000790792000004923574080416000357857631249678000412145287900239416875'

const XYChain = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'xyChain',
    })
    const boardData = useBoardData(puzzle)

    const rawXYChain = {
        isComposite: false,
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
                    t('linksDetails', { chainPath: joinStringsListWithArrow(chainCellsAxesList) })
                }
            />
            <View style={{ marginLeft: 8 }}>
                <SmartHintText
                    text={
                        t('linksSequence', {
                            chainPath: joinStringsListWithArrow(chainCellsAxesList),
                        })
                    }
                />
            </View>
        </>
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
            {renderXYChainExampleLinksDetails()}
            {renderChainEffectOnPuzzle()}
        </View>
    )
}

export default React.memo(XYChain)
