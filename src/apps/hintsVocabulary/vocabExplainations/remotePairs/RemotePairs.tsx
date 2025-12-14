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
import { useSmartHintsTranslations } from '../hooks/useSmartHintsTranslations'
import { getLinkHTMLText } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const puzzle = '798452316603781092012030870370265048820143760060897023980014237107028050200070081'

const RemotePairs = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'remotePairs',
    })
    const boardData = useBoardData(puzzle)
    const smartHintsTranslationsTexts = useSmartHintsTranslations()

    const rawRemotePairs = {
        isComposite: false,
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
        smartHintsTranslationsTexts,
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
                text={t('howToMakeChain')}
            />
        </View>
    )

    const renderChainFormationDetails = () => {
        const chainText = joinStringsListWithArrow(_map(rawRemotePairs.orderedChainCells, (chainCell: Cell) => getCellAxesValues(chainCell)))
        return (
            <SmartHintText
                text={
                    t('chainFormation.intro', { chainPath: chainText })
                }
            />
        )
    }

    const renderChainEffectOnPuzzle = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    t('chainEffect.intro', { linkPattern: joinStringsListWithArrow(['Strong', 'Weak', 'Strong']) })
                }
            />
            <SmartHintText
                text={
                    t('chainEffect.firstWay', { chainCell0: chainCellsAxesList[0], chainCell1: chainCellsAxesList[1], chainCell2: chainCellsAxesList[2], chainCell3: chainCellsAxesList[3] })
                }
            />
            {Example}
            <SmartHintText
                text={
                    t('chainEffect.firstWayConclusion', { firstCell: _head(chainCellsAxesList), lastCell: _last(chainCellsAxesList) })
                }
            />
            <SmartHintText
                text={
                    t('chainEffect.secondWay', {
                        chainCell0: chainCellsAxesList[0],
                        chainCell1: chainCellsAxesList[1],
                        chainCell2: chainCellsAxesList[2],
                        chainCell3: chainCellsAxesList[3],
                        firstCell: _head(chainCellsAxesList),
                        lastCell: _last(chainCellsAxesList),
                    })
                }
            />
            <SmartHintText
                text={
                    t('chainEffect.secondWayConclusion', { firstCell: _head(chainCellsAxesList), lastCell: _last(chainCellsAxesList) })
                }
            />
            <View style={{ marginTop: 8 }}>
                <SmartHintText
                    text={
                        t('chainEffect.finalConclusion')
                    }
                />
            </View>
        </View>
    )

    const renderValidChainLengthDetails = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    t('validChainLength')
                }
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
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
