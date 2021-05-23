import { StyleSheet } from 'react-native'
import { CELL_HEIGHT, CELL_WIDTH } from '../dimensions'

export const Styles = StyleSheet.create({
    cell: {
        display: 'flex',
        // flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // height: CELL_HEIGHT,
        // width: CELL_WIDTH,
        backgroundColor: 'white'
    },
    mainNumberText: { // fontSize
        fontSize: 20,
        // width: '100%',
    },
    notesContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-around',
        width: '100%',
    },
    notesRow: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        justifyContent: 'space-around',
    },
    noteCell: {
        display: 'flex',
        justifyContent: 'center',
    },
    noteText: {
        color: 'rgba(0, 0, 0, .8)',
        fontSize: 8, // convert this to relative to the cellWidth
        alignSelf: 'center',
    },
})
