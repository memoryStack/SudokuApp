import React from 'react'

import { View } from 'react-native'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { areSameCells } from '@domain/board/utils/housesAndCells'
import { getStyles } from './emptyRectangle.styles'
import { getLinkHTMLText } from '../utils'
import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { isCellExists } from 'src/apps/arena/utils/util'
import { hexToRGBA } from '@utils/util'

const EmptyRectangle = () => {
    const styles = useStyles(getStyles)

    const renderCandidateValidPattenInBlockExamples = () => {
        const puzzle = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle, false)
        const notes = NotesRecord.initNotes()

        const cells = [
            { row: 1, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },

            { row: 3, col: 4 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 5, col: 4 },

            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 0, col: 8 },

            { row: 6, col: 0 },
            { row: 6, col: 1 },
            { row: 7, col: 2 },
            { row: 6, col: 2 },
            { row: 8, col: 2 },
        ]

        const rowCellColor = hexToRGBA('#00FF00', 30)
        const intersectionCell = hexToRGBA('#007E56', 30)
        const colCellColor = hexToRGBA('#0000FF', 30)

        const intersectionCells = [
            { row: 0, col: 0 },
            { row: 1, col: 8 },
            { row: 4, col: 4 },
            { row: 6, col: 2 },
        ]

        const rowCells = [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 4, col: 3 },
            { row: 4, col: 5 },
            { row: 6, col: 0 },
            { row: 6, col: 1 },
        ]

        const colCells = [
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 0, col: 8 },
            { row: 2, col: 8 },
            { row: 3, col: 4 },
            { row: 5, col: 4 },
            { row: 7, col: 2 },
            { row: 8, col: 2 },
        ]

        cells.forEach(({ row, col }) => {
            notes[row][col][3].show = 1
        })

        return (
            <>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + '<b>valid patterns of the candidate in the block:</b>'
                            + '</p>'
                        }
                    />
                </View>
                <View style={styles.exampleBoardContainer}>
                    <ReactNativeZoomableView
                        initialZoom={1}
                        zoomEnabled={false}
                        disableShifting
                    >
                        <Board
                            mainNumbers={mainNumbers}
                            notes={notes}
                            showCellContent
                            showHintsSVGView
                            getCellBGColor={(cell) => {
                                if (isCellExists(cell, intersectionCells)) return { backgroundColor: intersectionCell }
                                if (isCellExists(cell, rowCells)) return { backgroundColor: rowCellColor }
                                if (isCellExists(cell, colCells)) return { backgroundColor: colCellColor }
                                return null
                            }}
                        />
                    </ReactNativeZoomableView>
                </View>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'in all of the blocks displayed above, the candidate is present in only <b>one row and one column</b>.'
                            + ' And the rows and columns are also highlighted which contains these candidates in each block house.'
                            + ' For Example, in 1st block, candidate 4 is present in 1st column and Ath row only.'
                            + '</p>'
                        }
                    />
                </View>
            </>
        )
    }

    const renderCandidateInvalidPattenInBlockExamples = () => {
        const puzzle = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle, false)
        const notes = NotesRecord.initNotes()

        const cells = [
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },

            { row: 6, col: 2 },
            { row: 8, col: 0 },

            { row: 6, col: 6 },
            { row: 7, col: 6 },
            { row: 7, col: 7 },
            { row: 8, col: 7 },

            { row: 2, col: 6 },
            { row: 1, col: 7 },
            { row: 0, col: 8 },
        ]

        cells.forEach(({ row, col }) => {
            notes[row][col][3].show = 1
        })

        return (
            <>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + '<b>invalid patterns of the candidate in block:</b>'
                            + '</p>'
                        }
                    />
                </View>
                <View style={styles.exampleBoardContainer}>
                    <ReactNativeZoomableView
                        initialZoom={1}
                        zoomEnabled={false}
                        disableShifting
                    >
                        <Board
                            mainNumbers={mainNumbers}
                            notes={notes}
                            showCellContent
                            showHintsSVGView
                        />
                    </ReactNativeZoomableView>
                </View>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'Why above patterns are invalid ?'
                            + '<br/>'
                            + '<ul>'
                            + `<li><b>3rd block:</b> candidates in this block can not be fitted into any pair of a row and a column. if we choose one column, let's say 9th, then we need two rows B and C and if we choose one row, let's say C, then we need two columns 8th and 9th</li>`
                            + '<li><b>5th block:</b> here all the candidates can be fitted into row E only and no candidates are left that can be fitted into a column as well</li>'
                            + '<li><b>7th block:</b> candidate is present only two times in the block. we need it to be present atleast three times</li>'
                            // TODO: add a link that explains why candidate has to be present atleast three times.
                            + '<li><b>9th block:</b> same reason as explained above for 3rd block</li>'
                            + '</ul>'
                            + '</p>'
                        }
                    />
                </View>
            </>
        )
    }

    const renderIntersectionCellExamples = () => {
        const puzzle = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle, false)
        const notes = NotesRecord.initNotes()

        const cells = [
            { row: 1, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },

            { row: 3, col: 4 },
            { row: 4, col: 3 },
            { row: 4, col: 4 },
            { row: 4, col: 5 },
            { row: 5, col: 4 },

            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 0, col: 8 },

            { row: 6, col: 0 },
            { row: 6, col: 1 },
            { row: 7, col: 2 },
            { row: 6, col: 2 },
            { row: 8, col: 2 },
        ]

        cells.forEach(({ row, col }) => {
            notes[row][col][3].show = 1
        })

        const intersectionCells = [
            { row: 0, col: 0 },
            { row: 1, col: 8 },
            { row: 4, col: 4 },
            { row: 6, col: 2 },
        ]

        return (
            <>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'Once you are able to find a valid arrangement of the candidate in a block house, now focus on the'
                            + ' intersection of the row and column in which the candidate is present in the block. This <b>intersection cell</b> is'
                            + ' important.'
                            + '</p>'
                        }
                    />
                </View>
                <View style={styles.exampleBoardContainer}>
                    <ReactNativeZoomableView
                        initialZoom={1}
                        zoomEnabled={false}
                        disableShifting
                    >
                        <Board
                            mainNumbers={mainNumbers}
                            notes={notes}
                            showCellContent
                            showHintsSVGView
                            getCellBGColor={(cell) => {
                                if (isCellExists(cell, intersectionCells)) return styles.intersectionCell
                                return null
                            }}
                        />
                    </ReactNativeZoomableView>
                </View>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'in all of the blocks displayed above, the intersection cell has been highlighted.'
                            + ' For Example, in 5th block, candidate 4 is present in row E and column 5 and this row and column intersect at E5 cell.'
                            + '</p>'
                        }
                    />
                </View>
            </>
        )
    }

    const renderSideHousePattern = () => {
        const puzzle = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle, false)
        const notes = NotesRecord.initNotes()

        const rowSideHouseCells = [
            { row: 7, col: 3 },
            { row: 7, col: 8 }
        ]

        const colSideHouseCells = [
            { row: 1, col: 1 },
            { row: 4, col: 1 }
        ]

        const cells = [
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 0, col: 8 },
            ...rowSideHouseCells,
            ...colSideHouseCells
        ]

        cells.forEach(({ row, col }) => {
            notes[row][col][3].show = 1
        })

        const intersectionCells = [{ row: 1, col: 8 }]

        // TODO: "seen by" is this term explained in the vocabulary ??

        return (
            <>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'Now we need to find either a row or a column which is not part of the block house and in which this candidate can come <b>only 2 times</b>.'
                            + ` Let's call such a row or column as <b>Side House</b>.`
                            + '<br/>'
                            + '<b>Note:</b> One cell of this side house in which this candidate is present has to be seen by the intersection cell of the block house.'
                            + '</p>'
                        }
                    />
                </View>
                <View style={styles.exampleBoardContainer}>
                    <ReactNativeZoomableView
                        initialZoom={1}
                        zoomEnabled={false}
                        disableShifting
                    >
                        <Board
                            mainNumbers={mainNumbers}
                            notes={notes}
                            showCellContent
                            showHintsSVGView
                            getCellBGColor={(cell) => {
                                if (isCellExists(cell, intersectionCells)) return styles.intersectionCell
                                if (isCellExists(cell, rowSideHouseCells)) return { backgroundColor: 'rgba(0, 255, 0, 0.3)' }
                                if (isCellExists(cell, colSideHouseCells)) return { backgroundColor: 'rgba(255, 0, 0, 0.3)' }
                                return null
                            }}
                        />
                    </ReactNativeZoomableView>
                </View>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'In the above puzzle, row H and column 2nd are shown as an example of a valid Side House. In both of these'
                            + ' side houses candidate 4 is present only 2 times and one cell of each house is seen by the intersection cell'
                            + ' of the 3rd block house.'
                            + '</p>'
                        }
                    />
                </View>
            </>
        )
    }

    const renderRemovableNotesExample = () => {
        const puzzle = '000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const { mainNumbers } = getPuzzleDataFromPuzzleString(puzzle, false)
        const notes = NotesRecord.initNotes()

        const removableNoteHostCell = { row: 1, col: 3 }
        notes[1][3][1].show = 1
        notes[1][3][8].show = 1

        const rowSideHouseCells = [
            { row: 7, col: 3 },
            { row: 7, col: 8 }
        ]

        const cells = [
            { row: 1, col: 6 },
            { row: 1, col: 7 },
            { row: 1, col: 8 },
            { row: 0, col: 8 },
            ...rowSideHouseCells,
            removableNoteHostCell
        ]

        cells.forEach(({ row, col }) => {
            notes[row][col][3].show = 1
        })

        const intersectionCells = [{ row: 1, col: 8 }]

        return (
            <>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + '<b>How this hint removes notes:</b>'
                            + '<br />'
                            + `Once you have identified a block house and a row of column house with the properties explained above, it's time to find`
                            + ` the cell from which the candidate can be removed. Let's use the above example to understand this.`
                            + '</p>'
                        }
                    />
                </View>
                <View style={styles.exampleBoardContainer}>
                    <ReactNativeZoomableView
                        initialZoom={1}
                        zoomEnabled={false}
                        disableShifting
                    >
                        <Board
                            mainNumbers={mainNumbers}
                            notes={notes}
                            showCellContent
                            showHintsSVGView
                            getCellBGColor={(cell) => {
                                if (isCellExists(cell, intersectionCells)) return styles.intersectionCell
                                if (isCellExists(cell, rowSideHouseCells)) return { backgroundColor: 'rgba(0, 255, 0, 0.3)' }
                                if (areSameCells(cell, removableNoteHostCell)) return { backgroundColor: 'yellow' }
                                return null
                            }}
                            getNoteStyles={({ noteValue }, cell) => {
                                if (areSameCells(cell, removableNoteHostCell) && noteValue === 4) return { color: 'rgba(255, 0, 0, 1)' }
                                return null
                            }}
                        />
                    </ReactNativeZoomableView>
                </View>
                <View style={styles.paragraphMarginTop}>
                    <SmartHintText
                        text={
                            '<p>'
                            + 'here 3rd block and row H makes Empty Rectangle with candidate 4. And H9 cell of Side House sees intersection cell and H4'
                            + ' is the other cell which does not see intersection cell in the block.'
                            + '<br />'
                            + 'The candidate 4 will be removed from the cell which sees the intersection cell (B9 here) and the other cell of Side House'
                            + ' which does not see intersection cell (H4 here).'
                            + '<br />'
                            + 'So, B4 is that cell from which candidate 4 will be removed. Other candidates of this cell will be safe.'
                            + '<br />'
                            + 'Now try to apply this hint in your real puzzles'
                            + '</p>'
                        }
                    />
                </View>
            </>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `To find an Empty Rectangle, we will focus on a single ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} in a ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'block house')}.`
                    + ' if this candidate is present only in one row and one column in that block house then this candidate'
                    + ' might make an Empty Rectangle.'
                    + '<br />'
                    + 'Note: the candidate has to be present <b>more than two times</b> in that block.'
                    + '</p>'
                }
            />
            {renderCandidateValidPattenInBlockExamples()}
            {renderCandidateInvalidPattenInBlockExamples()}
            {renderIntersectionCellExamples()}
            {renderSideHousePattern()}
            {renderRemovableNotesExample()}
        </View>
    )
}

export default React.memo(EmptyRectangle)
