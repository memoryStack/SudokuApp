import React, { useRef } from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { areSameCells } from 'src/apps/arena/utils/util'

import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { useStyles } from '@utils/customHooks/useStyles'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './candidate.styles'
import { useBoardData } from '../hooks/useBoardData'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Candidate = () => {
    const styles = useStyles(getStyles)

    const zoomableViewRef = useRef(null)

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <ReactNativeZoomableView
                ref={zoomableViewRef}
                initialZoom={2}
                zoomEnabled={false}
                initialOffsetX={70}
                initialOffsetY={90}
                disableShifting
            >
                <Board
                    {...boardData}
                    showCellContent
                    getCellBGColor={(cell: Cell) => {
                        if (areSameCells(cell, { row: 2, col: 2 })) return styles.highlightedCell
                        return null
                    }}
                />
            </ReactNativeZoomableView>
        </View>
    ) : null

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    `<p>A Candidate in Sudoku is a digit that could be placed into a <a href="${HINTS_VOCAB_IDS.CELL}">cell</a>, but you're not`
                    + ' totally sure it goes in that cell yet. Some people call this "pencil marking", since many solvers'
                    + ' write small numbers or other notes in pencil to denote a possible solution.</p>'
                }
            />
            {Example}
            <SmartHintText
                text={'Here in the highlighted cell above 2, 4, 8 and 9 are it\'s candidates'}
            />
        </View>
    )
}

export default React.memo(Candidate)
