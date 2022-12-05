import React, { useCallback, useState, useEffect, useMemo } from 'react'

import { View, StyleSheet, Linking, Image, Text } from 'react-native'

import PropTypes from 'prop-types'

import { SCREEN_NAME } from '../../resources/constants'
import { Button } from '../../components/button'
import { rgba } from '../../utils/util'
import { EVENTS } from '../../constants/events'
import { NextGameMenu } from '../arena/nextGameMenu'
import { useBoardElementsDimensions } from '../arena/hooks/useBoardElementsDimensions'

import { ExperimentalText } from './ExperimentalText'

const SUDOKU_LETTERS = ['S', 'U', 'D', 'O', 'K', 'U']

const getStyles = CELL_WIDTH => {
    return StyleSheet.create({
        container: {
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
        },
        startGameButtonContainer: {
            marginTop: '20%',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        sudokuTextContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: '5%',
            paddingHorizontal: 16,
        },
        sudokuLetterText: {
            width: CELL_WIDTH * 1.3,
            height: CELL_WIDTH * 1.3,
            backgroundColor: rgba('#d5e5f6', 60),
            borderRadius: 12,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: 'rgb(49, 90, 163)',
            fontSize: CELL_WIDTH * 0.75,
        },
        appIcon: {
            width: 100,
            height: 100,
            marginTop: '30%',
        },
        playButtonContainer: {
            backgroundColor: rgba('#d5e5f6', 60),
            borderRadius: 8,
            paddingHorizontal: 20,
            marginTop: '20%',
        },
        playButtonText: {
            color: 'rgb(49, 90, 163)',
            fontSize: 24,
        },
    })
}

const Home_ = ({ navigation }) => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const { CELL_WIDTH } = useBoardElementsDimensions()

    const styles = useMemo(() => {
        return getStyles(CELL_WIDTH)
    }, [CELL_WIDTH])

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
            navigation.navigate('Arena', { selectedGameMenuItem: item })
        },
        [navigation],
    )

    const launchDeeplinkPuzzle = url => {
        navigation.navigate('Arena', { puzzleUrl: url })
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
    const renderAppIcon = () => {
        return <Image source={require('../../resources/assets/appIcon.png')} style={styles.appIcon} />
    }

    const renderSudokuText = () => {
        const renderLetter = (letter, index) => {
            return (
                <Text style={styles.sudokuLetterText} key={`${index}`}>
                    {letter}
                </Text>
            )
        }

        return <View style={styles.sudokuTextContainer}>{SUDOKU_LETTERS.map(renderLetter)}</View>
    }

    const renderPlayButton = () => {
        return (
            <Button
                onClick={handlePlayOfflineClick}
                text={'Play'}
                containerStyle={styles.playButtonContainer}
                textStyles={styles.playButtonText}
            />
        )
    }

    const renderNewGameMenu = () => {
        if (!pageHeight || !showNextGameMenu) return null
        return (
            <NextGameMenu
                screenName={SCREEN_NAME.HOME}
                parentHeight={pageHeight}
                menuItemClick={handleMenuItemClicked}
                onMenuClosed={onNewGameMenuClosed}
            />
        )
    }

    return (
        <View style={styles.container} onLayout={onParentLayout}>
            {renderAppIcon()}
            {renderSudokuText()}
            {renderPlayButton()}
            {renderNewGameMenu()}
            <ExperimentalText navigation={navigation} />
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
