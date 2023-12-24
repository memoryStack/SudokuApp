import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './house.styles'

const House = () => {
    const styles = useStyles(getStyles)

    const ExampleBoard = (
        <View style={styles.exampleBoardContainer}>
            <Board />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `A house is a group of 9 <a href="${HINTS_VOCAB_IDS.CELL}">cells</a> in which numbers from 1 to 9 will be filled uniquely.`
                    + `There are three different types of houses: <a href="${HINTS_VOCAB_IDS.ROW}">rows</a>, <a href="${HINTS_VOCAB_IDS.COLUMN}">columns</a> and <a href="${HINTS_VOCAB_IDS.BLOCK}">blocks</a>.`
                    + '<br/>'
                    + 'A Sudoku board contains 9 row houses, 9 column houses and 9 block houses as you can see below.'
                    + '</p>'
                }
            />
            {ExampleBoard}
        </View>
    )
}

export default React.memo(House)
