import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { areSameCells, getNoteHostCellsInHouse, isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HOUSE_TYPE } from '@domain/board/board.constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'

import { LINK_TYPES } from 'src/apps/arena/utils/smartHints/chains/xChain/xChain.constants'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { getStyles } from './chainLinks.styles'
import { useBoardData } from '../hooks/useBoardData'
import { BoardData, getLinkHTMLText, getTrimmedBoardData } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const puzzle = '027958600900003000603000050009780000080634010000019700070000304000300001004571890'

const ChainLinks = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(puzzle)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'chainLinks',
    })

    const renderWeakLinkDefinition = () => {
        const renderWeakLinkExamplesInRow = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
                initialZoom: 1,
                initialOffsetX: 0,
                initialOffsetY: 125,
            }

            const candidateHostCells = getNoteHostCellsInHouse(8, { type: HOUSE_TYPE.ROW, num: 1 }, boardData.notes)
            const chain = [
                {
                    start: { cell: { row: 1, col: 2 }, note: 8 },
                    end: { cell: { row: 1, col: 7 }, note: 8 },
                    type: LINK_TYPES.WEAK,
                },
            ]

            const trimmedBoardData = getTrimmedBoardData(boardData, getHouseCells({ type: HOUSE_TYPE.ROW, num: 1 }))

            return (
                <>
                    <View style={{ width: '100%', height: 60 }}>
                        <ReactNativeZoomableView
                            initialZoom={zoomableViewConfigs.initialZoom}
                            zoomEnabled={false}
                            initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                            initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                            disableShifting
                        >
                            <Board
                                {...trimmedBoardData}
                                showCellContent
                                showHintsSVGView
                                svgProps={chain}
                                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                                    if (!show || noteValue !== 8 || !isCellExists(cell, candidateHostCells)) return null
                                    return {
                                        color: 'green',
                                        fontWeight: FONT_WEIGHTS.HEAVY,
                                    }
                                }}
                                boardContainerStyles={styles.board}
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={
                                t('weakLink.rowExample')
                            }
                        />
                    </View>
                </>
            )
        }

        const renderWeakLinkExamplesInCell = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
                initialZoom: 2,
                initialOffsetX: 0,
                initialOffsetY: 120,
            }

            const trimmedBoardData = getTrimmedBoardData(boardData, getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 1 }))

            return (
                <>
                    <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
                        <ReactNativeZoomableView
                            initialZoom={zoomableViewConfigs.initialZoom || 1}
                            zoomEnabled={false}
                            initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                            initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                            disableShifting
                        >
                            <Board
                                {...trimmedBoardData}
                                showCellContent
                                getNoteStyles={({ show }: Note, cell: Cell) => {
                                    if (!show || !areSameCells(cell, { row: 1, col: 4 })) return null
                                    return {
                                        color: 'green',
                                        fontWeight: FONT_WEIGHTS.HEAVY,
                                    }
                                }}
                                boardContainerStyles={styles.board}
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={t('weakLink.cellExample')}
                        />
                    </View>
                </>
            )
        }

        return (
            <View style={{ marginTop: 16 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>{t('weakLink.title')}</Text>
                <SmartHintText
                    text={t('weakLink.definition')}
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderWeakLinkExamplesInRow()}
                </View>
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderWeakLinkExamplesInCell()}
                </View>
                <SmartHintText
                    text={t('weakLink.note')}
                />
            </View>
        )
    }

    const firstRowTrimmedBoardData = !_isNil(boardData.mainNumbers)
        ? getTrimmedBoardData(boardData, getHouseCells({ type: HOUSE_TYPE.ROW, num: 0 })) : {} as BoardData

    const renderStrongLinkDefinition = () => {
        const renderStrongLinkExamplesInRow = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
                initialZoom: 1,
                initialOffsetX: 0,
                initialOffsetY: 165,
            }

            const candidateHostCells = getNoteHostCellsInHouse(4, { type: HOUSE_TYPE.ROW, num: 0 }, boardData.notes)
            const chain = [
                {
                    start: { cell: { row: 0, col: 0 }, note: 4 },
                    end: { cell: { row: 0, col: 7 }, note: 4 },
                    type: LINK_TYPES.STRONG,
                },
            ]

            return (
                <>
                    <View style={{ width: '100%', height: 60 }}>
                        <ReactNativeZoomableView
                            initialZoom={zoomableViewConfigs.initialZoom}
                            zoomEnabled={false}
                            initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                            initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                            disableShifting
                        >
                            <Board
                                mainNumbers={firstRowTrimmedBoardData.mainNumbers}
                                notes={firstRowTrimmedBoardData.notes}
                                showCellContent
                                showHintsSVGView
                                svgProps={chain}
                                getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                                    if (!show || noteValue !== 4 || !isCellExists(cell, candidateHostCells)) return null
                                    return {
                                        color: 'green',
                                        fontWeight: FONT_WEIGHTS.HEAVY,
                                    }
                                }}
                                boardContainerStyles={styles.board}
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={t('strongLink.rowExample')}
                        />
                    </View>
                </>
            )
        }

        const renderStrongLinkExamplesInCell = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
                initialZoom: 2,
                initialOffsetX: -50,
                initialOffsetY: 90,
            }

            const focusedCells = [
                { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 },
                { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 },
                { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 3, col: 6 },
            ]
            const trimmedBoardData = getTrimmedBoardData(boardData, focusedCells)

            return (
                <>
                    <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
                        <ReactNativeZoomableView
                            initialZoom={zoomableViewConfigs.initialZoom || 1}
                            zoomEnabled={false}
                            initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                            initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                            disableShifting
                        >
                            <Board
                                {...trimmedBoardData}
                                showCellContent
                                getNoteStyles={({ show }: Note, cell: Cell) => {
                                    if (!show || !areSameCells(cell, { row: 2, col: 5 })) return null
                                    return {
                                        color: 'green',
                                        fontWeight: FONT_WEIGHTS.HEAVY,
                                    }
                                }}
                                boardContainerStyles={styles.board}
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={t('strongLink.cellExample')}
                        />
                    </View>
                </>
            )
        }

        return (
            <View style={{ marginTop: 24 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>{t('strongLink.title')}</Text>
                <SmartHintText
                    text={
                        t('strongLink.definition')
                    }
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInRow()}
                </View>
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInCell()}
                </View>
                {/* TODO: how to add horizontal padding/space for <ol /> items ?? */}
                <SmartHintText
                    text={t('strongLink.note')}

                />
                <View style={{ marginLeft: 16 }}>
                    <SmartHintText
                        text={t('strongLink.formationRules')}
                    />
                </View>
            </View>
        )
    }

    const renderStrongAndWeakLinkOverlap = () => {
        const renderStrongLinkExamplesInRow = (linkType: LINK_TYPES) => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
                initialZoom: 1,
                initialOffsetX: 0,
                initialOffsetY: 165,
            }

            const candidateHostCells = getNoteHostCellsInHouse(4, { type: HOUSE_TYPE.ROW, num: 0 }, boardData.notes)
            const chain = [
                {
                    start: { cell: { row: 0, col: 0 }, note: 4 },
                    end: { cell: { row: 0, col: 7 }, note: 4 },
                    type: linkType,
                },
            ]

            return (
                <View style={{ width: '100%', height: 60 }}>
                    <ReactNativeZoomableView
                        initialZoom={zoomableViewConfigs.initialZoom}
                        zoomEnabled={false}
                        initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                        initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                        disableShifting
                    >
                        <Board
                            {...firstRowTrimmedBoardData}
                            showCellContent
                            showHintsSVGView
                            svgProps={chain}
                            getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                                if (!show || noteValue !== 4 || !isCellExists(cell, candidateHostCells)) return null
                                return {
                                    color: 'green',
                                    fontWeight: FONT_WEIGHTS.HEAVY,
                                }
                            }}
                            boardContainerStyles={styles.board}
                        />
                    </ReactNativeZoomableView>
                </View>
            )
        }
        return (
            <View style={{ marginTop: 24 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>{t('overlap.title')}</Text>
                <SmartHintText
                    text={t('overlap.intro')}
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInRow(LINK_TYPES.STRONG)}
                </View>
                <SmartHintText
                    text={
                        t('overlap.explanation')
                    }
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInRow(LINK_TYPES.WEAK)}
                </View>
                <SmartHintText
                    text={t('overlap.conclusion')}
                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {/* this definition of links simply talks about "candidates", is there a general entity for links ?? */}
            <SmartHintText
                text={t('intro')}
            />
            {renderWeakLinkDefinition()}
            {renderStrongLinkDefinition()}
            {renderStrongAndWeakLinkOverlap()}
        </View>
    )
}

export default React.memo(ChainLinks)
