import React, { useCallback, useState, useEffect, useMemo } from 'react'

import { View, Linking, Image, Text } from 'react-native'

import PropTypes from 'prop-types'

import { Button } from '../../components/button'

import { EVENTS } from '../../constants/events'
import { ROUTES } from '../../navigation/route.constants'

import { NextGameMenu } from '../arena/nextGameMenu'
import { useBoardElementsDimensions } from '../arena/hooks/useBoardElementsDimensions'
import { Settings } from '../header/components/settings/settings'

import { getStyles } from './styles'

const SUDOKU_LETTERS = ['S', 'U', 'D', 'O', 'K', 'U']

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
            <View style={{ marginTop: 40 }}>
                <Settings navigation={navigation} />
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
