import React, { useCallback, useState, useEffect } from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import { NextGameMenu } from '../arena/nextGameMenu'
import { SCREEN_NAME } from '../../resources/constants'
import { Button } from '../../components/button'
import { START_GAME } from '../../resources/stringLiterals'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    startGameButtonContainer: {
        top: 200,
    },
})

const Home_ = ({ navigation }) => {
    const [pageHeight, setPageHeight] = useState(0)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

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
        Linking.addEventListener('url', handler)
        return () => Linking.removeEventListener('url', handler)
    }, [])

    return (
        <View style={styles.container} onLayout={onParentLayout}>
            <Button
                onClick={handlePlayOfflineClick}
                text={START_GAME}
                containerStyle={styles.startGameButtonContainer}
            />
            {pageHeight && showNextGameMenu ? (
                <NextGameMenu
                    screenName={SCREEN_NAME.HOME}
                    parentHeight={pageHeight}
                    menuItemClick={handleMenuItemClicked}
                    onMenuClosed={onNewGameMenuClosed}
                />
            ) : null}
        </View>
    )
}

export const Home = React.memo(Home_)
