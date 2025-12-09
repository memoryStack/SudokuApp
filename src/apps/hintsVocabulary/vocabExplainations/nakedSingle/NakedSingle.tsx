import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { areCommonHouseCells, areSameCells } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { useBoardData } from '../hooks/useBoardData'

import { getStyles } from './nakedSingle.styles'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const examplePuzzle = '007005068005800100008197005010050600704286903002010050400539800009008400820400500'

const nakedSingleHostCell = { row: 3, col: 2 }

const NakedSingle = () => {
    const styles = useStyles(getStyles)
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'nakedSingle',
    })
    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (areSameCells(cell, nakedSingleHostCell)) return styles.nakedSingleHostCell
                    if (areCommonHouseCells(cell, nakedSingleHostCell)) return styles.sameHouseAsNSHostCell
                    return null
                }}
            />
        </View>
    ) : null

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
            />
            {Example}
            <SmartHintText
                text={t('example')}
            />
        </View>
    )
}

export default React.memo(NakedSingle)
