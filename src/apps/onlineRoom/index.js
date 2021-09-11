import React, { useCallback, useRef } from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { NewGameButton } from '../arena/newGameButton'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    createRoomButtonContainer: { marginTop: 150 },
    joinRoomContainer: {
        width: '80%',
        flexDirection: 'row',
        marginTop: 200,
    },
    joinRoomButtonContainer: { marginRight: 16 },
    roomIDInput: {
        fontSize: 24,
        color: 'rgba(0, 0, 0, .8)',
        paddingHorizontal: 8,
        flex: 1,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, .1)',
    },
})

// TODO: make this input view as keyboard aware
const OnlineRoom_ = ({ navigation }) => { 

    const roomIDInputRef = useRef(null)

    const handleCreateRoomClick = useCallback(() => {
    
    }, [])

    const handleJoinRoomClick = useCallback(() => {
        
    }, [])

    return (
        <View style={styles.container}>
            <NewGameButton
                onClick={handleCreateRoomClick}
                text={'Create Room'}
                containerStyle={styles.createRoomButtonContainer}
            />
            <View style={styles.joinRoomContainer}> 
                <NewGameButton
                    onClick={handleJoinRoomClick}
                    text={'Join Room'}
                    containerStyle={styles.joinRoomButtonContainer}
                />
                <TextInput
                    ref={roomIDInputRef}
                    autoCapitalize='none'
                    placeholder={'e.g 12345'} // later it will be changed to alpha-numeric
                    placeholderTextColor={'rgba(0, 0, 0, .3)'}
                    style={styles.roomIDInput}
                />
            </View>
        </View>
    )
}

export const OnlineRoom = React.memo(OnlineRoom_)
