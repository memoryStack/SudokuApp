import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { getStyles } from './chain.styles'
import { getLinkHTMLText } from '../utils'

const Chain = () => {
    const styles = useStyles(getStyles)

    const renderHowToMakeAChain = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={
                    '<p>'
                    + 'There are many types of Chain techniques as given below:'
                    + '<br />'
                    + '<ol>'
                        + `<li>${getLinkHTMLText(HINTS_VOCAB_IDS.REMOTE_PAIRS, 'Remote Pairs')}</li>`
                        + `<li>${getLinkHTMLText(HINTS_VOCAB_IDS.X_CHAIN, 'X-Chain')}</li>`
                    + '</ol>'
                    + '<br />'
                    + '<br />'
                    + 'Click on one of these to better understand how powerful chain techniques are.'
                    + '</p>'
                }
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + 'Chains are advanced sudoku solving techniques.'
                    + ` A chain is simply a stream of implications that lead from an assumption (e.g. ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} x in ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')} y can not come)`
                    + ' to some result.'
                    + '</p>'
                }
            />
            {renderHowToMakeAChain()}
            {/* {renderHowToMakeAChain()}
            {Example}
            {renderChainFormationDetails()}
            {renderChainEffectOnPuzzle()}
            {renderValidChainLengthDetails()} */}
        </View>
    )
}

export default React.memo(Chain)
