import React, { useCallback, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { NewGameButton } from '../arena/newGameButton'
import { NextGameMenu } from '../arena/nextGameMenu'

const styles = StyleSheet.create({
    buttonContainer: {

    }
})

const Home_ = ({ navigation }) => {    
    const [pageHeight, setPageHeight] = useState(0)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const handlePlayOnlineClick = useCallback(() => {
        // navigate to online room screen
    }, [])

    const handlePlayOfflineClick = useCallback(() => {
        setShowNextGameMenu(true)
    }, [])
    
    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => {
        setPageHeight(height)
    }, [])

    const onNewGameMenuClosed = useCallback(() => {
        setShowNextGameMenu(false)
    }, [])

    const handleMenuItemClicked = useCallback(item => {
        setShowNextGameMenu(false)
        navigation.navigate('Arena', { selectedGameMenuItem: item })
    }, [])

    return (
        <View
            style={{
                alignItems: 'center',
                height: '100%',
                width: '100%',
                backgroundColor: 'white',
            }}
            onLayout={onParentLayout}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '100%',
                    top: 200,
                }}
            >
                <NewGameButton
                    onClick={handlePlayOnlineClick}
                    text={'Play Online'}
                />
                <NewGameButton
                    onClick={handlePlayOfflineClick}
                    text={'Play Offline'}
                />
            </View>
            {
                pageHeight && showNextGameMenu ?
                    <NextGameMenu
                        parentHeight={pageHeight}
                        menuItemClick={handleMenuItemClicked}
                        onMenuClosed={onNewGameMenuClosed}
                    /> 
                : null
            }
        </View>
    )
}

export const Home = React.memo(Home_)
