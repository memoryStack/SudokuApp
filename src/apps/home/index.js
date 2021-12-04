import React, { useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'
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
