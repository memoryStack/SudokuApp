import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { areSameCells, isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { useBoardData } from '../hooks/useBoardData'

import { getStyles } from './hiddenSingle.styles'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const hiddenSingleHostCell = { row: 2, col: 0 }
const hiddenSingleCauseCells = [
    { row: 1, col: 3 },
    { row: 5, col: 2 },
    { row: 8, col: 1 },
]

const HiddenSingle = () => {
    const styles = useStyles(getStyles)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'hiddenSingle',
    })

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (areSameCells(cell, hiddenSingleHostCell)) return styles.hiddenSingleHostCell
                    if (isCellExists(cell, hiddenSingleCauseCells)) return styles.hiddenSingleCauseCell
                    if (getCellHouseForHouseType(HOUSE_TYPE.BLOCK, cell).num === 0) return styles.hostHouseCell
                    return null
                }}
            />
        </View>
    ) : null

    const HowToSpot = (
        <View style={styles.spotHiddenSingle}>
            <Text type={TEXT_VARIATIONS.HEADING_SMALL}>
                {t('howToSpotTitle')}
            </Text>
            <SmartHintText
                text={t('howToSpot')}
            />
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
            <SmartHintText
                text={t('example')}
            />
            {HowToSpot}
        </View>
    )
}

export default React.memo(HiddenSingle)
