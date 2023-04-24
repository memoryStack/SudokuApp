import React, {
    useCallback, useState, useEffect,
} from 'react'

import {
    View, Linking, Image, Text,
} from 'react-native'

import PropTypes from 'prop-types'

import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { useStyles } from '@utils/customHooks/useStyles'

import ExperimentalButton from 'src/ui/molecules/Button'
import ExperimentalText from 'src/ui/atoms/Text'
import { Button } from '../../components/button'
import { EVENTS } from '../../constants/events'
import { ROUTES } from '../../navigation/route.constants'

import { NextGameMenu } from '../arena/nextGameMenu'

import { LANGUAGE_VS_TITLE_CHARS } from './home.constants'
import { getStyles } from './styles'

const Home_ = ({ navigation }) => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const { t, selectedLanguage } = useTranslation()

    const SUDOKU_LETTERS = LANGUAGE_VS_TITLE_CHARS[selectedLanguage]

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

    // TODO: put these screenNames to constants
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
                __DEV__ && console.log(error)
            })
    }, [])

    useEffect(() => {
        const handler = ({ url }) => {
            launchDeeplinkPuzzle(url)
        }
        Linking.addEventListener(EVENTS.LINKING_URL, handler)
        return () => Linking.removeEventListener(EVENTS.LINKING_URL, handler)
    }, [])

    // TODO: get these assets from a central place
    const renderAppIcon = () => <Image source={require('../../resources/assets/appIcon.png')} style={styles.appIcon} />

    const renderSudokuText = () => {
        const renderLetter = (letter, index) => (
            <Text style={styles.sudokuLetterText} key={`${index}`}>
                {letter}
            </Text>
        )

        return <View style={styles.sudokuTextContainer}>{SUDOKU_LETTERS.map(renderLetter)}</View>
    }

    const renderPlayButton = () => (
        <Button
            onClick={handlePlayOfflineClick}
            text={t('PLAY  000')}
            containerStyle={styles.playButtonContainer}
            textStyles={styles.playButtonText}
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

    const [st, setSt] = useState('enabled')
    useEffect(() => {
        setTimeout(() => {
            setSt('disabled')
        }, 5000)
    }, [])

    return (
        <View style={styles.container} onLayout={onParentLayout}>
            {renderAppIcon()}
            {renderSudokuText()}
            {renderPlayButton()}
            {renderNewGameMenu()}

            <View style={{
                marginTop: 24,
            }}
            >
                {/* <ExperimentalButton
                    text="Experiment"
                    textStyles={{
                        // only fontWeight 700 works
                        fontWeight: '800',
                    }}
                // state={st}
                /> */}

                <ExperimentalText style={{ fontWeight: '400' }}>
                    Play 400
                </ExperimentalText>
                <ExperimentalText style={{ fontWeight: '500' }}>
                    Play 500
                </ExperimentalText>
                <ExperimentalText style={{ fontWeight: '600' }}>
                    Play 600
                </ExperimentalText>
                <ExperimentalText style={{ fontWeight: '700' }}>
                    Play 700
                </ExperimentalText>

            </View>

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
