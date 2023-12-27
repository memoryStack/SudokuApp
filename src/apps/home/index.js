import React, {
    useCallback, useState, useEffect,
} from 'react'

import {
    View, Linking,
} from 'react-native'

import PropTypes from 'prop-types'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { consoleLog } from '@utils/util'

import SmartHintText from '@ui/molecules/SmartHintText'

import { useTranslation } from '../../i18n/hooks/useTranslation'

import { EVENTS } from '../../constants/events'
import { ROUTES } from '../../navigation/route.constants'

import { NextGameMenu } from '../arena/nextGameMenu'

import { HOME_PAGE_TEST_ID } from './home.constants'
import { getStyles } from './home.styles'
import { HINTS_VOCAB_IDS } from '../arena/utils/smartHints/rawHintTransformers'

const Home_ = ({ navigation }) => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const { t } = useTranslation()

    const styles = useStyles(getStyles)

    const handlePlayOfflineClick = useCallback(() => {
        setShowNextGameMenu(true)
    }, [])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => {
        setPageHeight(height)
    }, [])

    const onNewGameMenuClosed = useCallback(() => {
        setShowNextGameMenu(false)
    }, [])

    const handleMenuItemClicked = useCallback(
        item => {
            setShowNextGameMenu(false)
            navigation.navigate(ROUTES.ARENA, { selectedGameMenuItem: item })
        },
        [navigation],
    )

    const launchDeeplinkPuzzle = url => {
        navigation.navigate(ROUTES.ARENA, { puzzleUrl: url })
    }

    useEffect(() => {
        Linking.getInitialURL()
            .then(url => {
                url && launchDeeplinkPuzzle(url)
            })
            .catch(error => {
                consoleLog(error)
            })
    }, [])

    useEffect(() => {
        const handler = ({ url }) => {
            launchDeeplinkPuzzle(url)
        }
        Linking.addEventListener(EVENTS.LINKING_URL, handler)
        return () => Linking.removeEventListener(EVENTS.LINKING_URL, handler)
    }, [])

    const renderSudokuText = () => (
        <Text
            type={TEXT_VARIATIONS.DISPLAY_LARGE}
            style={styles.gameDisplayName}
        >
            {'SUPER\nSUDOKU'}
        </Text>
    )

    const renderPlayButton = () => (
        <Button
            onPress={handlePlayOfflineClick}
            label={t('PLAY')}
            containerStyle={styles.playButtonContainer}
        />
    )

    const renderGameRulesCTA = () => (
        <Button
            type={BUTTON_TYPES.OUTLINED}
            label={t('How To Play ?')}
            containerStyle={styles.gameRulesCTA}
            onPress={() => navigation.navigate(ROUTES.PLAY_GUIDE)}
        />
    )

    const renderNewGameMenu = () => {
        if (!pageHeight || !showNextGameMenu) return null
        return (
            <NextGameMenu
                parentHeight={pageHeight}
                menuItemClick={handleMenuItemClicked}
                onMenuClosed={onNewGameMenuClosed}
            />
        )
    }

    useEffect(() => {
        navigation.navigate(ROUTES.HINTS_VOCABULARY_EXPLAINATION, { vocabKeyword: HINTS_VOCAB_IDS.CHAIN_LINKS })
    }, [])

    // TODO: use <Page /> here
    return (
        <View
            testID={HOME_PAGE_TEST_ID}
            style={styles.container}
            onLayout={onParentLayout}
        >
            <View style={styles.viewContainer}>
                {renderSudokuText()}
                {renderPlayButton()}
                {renderGameRulesCTA()}
            </View>
            {renderNewGameMenu()}
        </View>
    )
}

export const Home = React.memo(Home_)

Home_.propTypes = {
    navigation: PropTypes.object,
}

Home_.defaultProps = {
    navigation: {},
}
