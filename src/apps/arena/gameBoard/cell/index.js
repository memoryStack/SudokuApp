import React from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { GAME_STATE, EVENTS } from '../../../../resources/constants'
import { emit } from '../../../../utils/GlobalEventBus'

// becoz only 3 notes are there in a row
const looper = []
for(let i=0;i<3;i++) looper.push(i)

// test for these default values and their types
const Cell_ = ({ 
    row,
    col,
    cellNotes = [],
    cellMainValue = 0,
    cellBGColor = null,
    mainValueFontColor = null,
    gameState,
    screenName,
}) => {

    const shouldRenderNotes = () => {
        for (let noteNum=0;noteNum<9;noteNum++)
            if (cellNotes[noteNum].show) return 1
        return 0
    }

    const getCellNotes = () => {
        const cellNotesRows = looper.map((row) => {
            const cellNotesRow = looper.map((col) => {
                const noteNum = row * 3 + col
                const { show, noteValue } = cellNotes[noteNum] || {}
                return (
                    <View key={`${noteNum}`} style={Styles.noteContainer}>
                        <Text style={Styles.noteText}>
                            {show ? `${noteValue}` : ''}
                        </Text>
                    </View>
                )
            })
            return <View style={Styles.notesRow} key={`${row}`}>{cellNotesRow}</View>
        })
        return <View style={Styles.notesContainer}>{cellNotesRows}</View>
    }

    const onPress = () => {
        if (gameState !== GAME_STATE.ACTIVE) return
        emit(screenName + EVENTS.SELECT_CELL, { row, col })
    }

    const renderCell = () => {
        const containerStyle = [Styles.cell, cellBGColor]
        return (
            <Touchable
                touchable={TouchableTypes.opacity}
                activeOpacity={1}
                style={containerStyle}
                onPress={onPress}
            >
                {
                    gameState !== GAME_STATE.INACTIVE ?
                        (
                            cellMainValue ?
                                <Text style={[Styles.mainNumberText, mainValueFontColor]}> {`${cellMainValue}`} </Text>
                            : shouldRenderNotes() ? getCellNotes(row, col) : null
                        )
                    : null
                }
            </Touchable>
        )
    }

    return renderCell()
}

export const Cell = React.memo(Cell_)
