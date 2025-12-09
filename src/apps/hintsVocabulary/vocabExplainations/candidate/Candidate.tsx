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
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Candidate = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <ReactNativeZoomableView
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
                    boardContainerStyles={styles.board}
                />
            </ReactNativeZoomableView>
        </View>
    ) : null

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'candidate',
    })

    return (
        <View style={styles.container}>
            <SmartHintText text={t('intro')} />
            <View >
                {Example}
            </View>
            <SmartHintText text={t('observation')} />
        </View>
    )
}

export default React.memo(Candidate)
