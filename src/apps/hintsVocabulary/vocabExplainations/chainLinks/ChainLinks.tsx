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
import { getLinkHTMLText, getTrimmedBoardData } from '../utils'

const puzzle = '027958600900003000603000050009780000080634010000019700070000304000300001004571890'

const ChainLinks = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(puzzle)

    const renderWeakLinkDefinition = () => {
        const renderWeakLinkExamplesInRow = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
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
                            initialZoom={zoomableViewConfigs.initialZoom || 1}
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
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={
                                '<p>'
                                + 'Here in above example, if candidate 8 is filled or <b>true</b> in 3rd cell of this row then this candidate'
                                + ` has to be <b>false</b> for 8th and 9th cells of this ${getLinkHTMLText(HINTS_VOCAB_IDS.ROW, 'row')}.`
                                + ' Same way if 8 is true for 8th cell then it has to be false for 3rd and 9th cell.'
                                + ' So candidate 8s are Weakly linked with each other in these cells of this row.'
                                + '<br />'
                                + `Here row is taken as an example, but with the same logic Weak links can be found in ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')} and ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')} houses.`
                                + '</p>'
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
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={
                                '<p>'
                                + 'Here a cell is taken as an example to show how Weak links work in a cell.'
                                + ' The logic would be same as we applied before. Here the cell has three candidates 2, 4 and 6.'
                                + ' If any one of these three is <b>true</b> then all the other candidates have to be <b>false</b>.'
                                + ' Hence Weak links can be formed in a Single Cell as well.'
                                + '</p>'
                            }
                        />
                    </View>
                </>
            )
        }

        return (
            <View style={{ marginTop: 16 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>Weak Link</Text>
                <SmartHintText
                    text={
                        '<p>'
                        + 'If two candidates are Weakly linked, they cannot be <b>true</b> at the same time.'
                        + '\nIf one of them is <b>true</b>, then the other must be <b>false</b>. Visually Weak Links are drawn'
                        + ' in dotted lines. See the examples below.'
                        + '</p>'
                    }
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderWeakLinkExamplesInRow()}
                </View>
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderWeakLinkExamplesInCell()}
                </View>
                <SmartHintText
                    text={
                        '<p>'
                        + '<b>Note:</b> In Weak links if a candidate is false in a cell then we can not say'
                        + ' whether other candidates would be true of false. For Example, in above diagram, if'
                        + ' candidate 2 is false in the cell then we can not surely say whether 4 or 6 will be true or false.'
                        + '</p>'
                    }
                />
            </View>
        )
    }

    const firstRowTrimmedBoardData = !_isNil(boardData.mainNumbers)
        ? getTrimmedBoardData(boardData, getHouseCells({ type: HOUSE_TYPE.ROW, num: 0 })) : {}

    const renderStrongLinkDefinition = () => {
        const renderStrongLinkExamplesInRow = () => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
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
                            initialZoom={zoomableViewConfigs.initialZoom || 1}
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
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={
                                '<p>'
                                + 'Here in above example, if candidate 4 is not filled or <b>false</b> in 1st cell of this row then this candidate'
                                + ' has to be <b>true</b> in 8th cell of this row. So there is a Strong link between candidate 4 in this row.'
                                + '</p>'
                            }
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
                            />
                        </ReactNativeZoomableView>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <SmartHintText
                            text={
                                '<p>'
                                + 'Here a cell is taken as an example to show how Strong link works in a cell.'
                                + ' The logic would be same as we applied before. Here the cell has two candidates 2 and 7.'
                                + ' If any one of these two is <b>false</b> then the other candidate has to be <b>true</b>.'
                                + ' Hence Strong link can be formed in a Single Cell as well.'
                                + '</p>'
                            }
                        />
                    </View>
                </>
            )
        }

        return (
            <View style={{ marginTop: 24 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>Strong Link</Text>
                <SmartHintText
                    text={
                        '<p>'
                        + 'When two candidates are Strongly linked, they cannot be <b>false</b> at the same time.'
                        + '\nIf one of them is <b>false</b>, then the other must be <b>true</b>. Notice the difference'
                        + ' between Strong link and Weak link definition.'
                        + '\nVisually Strong Links are drawn in solid lines. See the examples below.'
                        + '</p>'
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
                    text={
                        '<p>'
                        + '<b>Note:</b> In general we can say that Strong Link is formed only in two ways'
                        + '</p>'
                    }
                />
                <View style={{ marginLeft: 16 }}>
                    <SmartHintText
                        text={
                            '<ol>'
                            + '<li>When a candidate is present in only two cells of a house</li>'
                            + '<li>When only two candidates are present in a cell</li>'
                            + '</ol>'
                        }
                    />
                </View>
            </View>
        )
    }

    const renderStrongAndWeakLinkOverlap = () => {
        const renderStrongLinkExamplesInRow = (linkType: LINK_TYPES) => {
            if (_isNil(boardData.mainNumbers)) return null

            const zoomableViewConfigs = {
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
                        initialZoom={zoomableViewConfigs.initialZoom || 1}
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
                        />
                    </ReactNativeZoomableView>
                </View>
            )
        }
        return (
            <View style={{ marginTop: 24 }}>
                <Text type={TEXT_VARIATIONS.TITLE_LARGE}>Use Strong Link as a Weak Link</Text>
                <SmartHintText
                    text={
                        '<p>'
                        + 'A Strong Link can be used as a Weak link. But a Weak link can\'t be used as a Strong Link.'
                        + ' See below examples to understand it.'
                        + '</p>'
                    }
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInRow(LINK_TYPES.STRONG)}
                </View>
                <SmartHintText
                    text={
                        '<p>'
                        + 'We have seen this example in Strong Link section. Now let\'s apply Weak link definition to this Strong link and'
                        + ' see if a Strong link can be used as a Weak link or not.'
                        + '</p>'
                    }
                />
                <View style={{ marginVertical: 8, marginTop: 20 }}>
                    {renderStrongLinkExamplesInRow(LINK_TYPES.WEAK)}
                </View>
                <SmartHintText
                    text={
                        '<p>'
                        + 'So in this row if 4 is <b>true</b> in 1st cell then it must be <b>false</b> in 8th cell.'
                        + ' Hence, a Strong link follows the definition of Weak link correctly.'
                        + '</p>'
                    }
                />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {/* this definition of links simply talks about "candidates", is there a general entity for links ?? */}
            <SmartHintText
                text={
                    '<p>'
                    + 'Links are the building blocks of all chains. If you don\'t understand Links then you will not be able to understand'
                    + ` Chain techniques.\nLinks define a relationship between ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} of two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')}`
                    + ` in a ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'house')} or candidates of a single cell as well. There are two types of links <b>Strong</b> link and <b>Weak</b> link.`
                    + '</p>'
                }
            />
            {renderWeakLinkDefinition()}
            {renderStrongLinkDefinition()}
            {renderStrongAndWeakLinkOverlap()}
        </View>
    )
}

export default React.memo(ChainLinks)
