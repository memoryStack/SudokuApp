import { initBoardData as initMainNumbers } from '../../../../utils/util'

// TODO: move it to utils
const initNotesInfo = () => {
    const notesInfo = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowNotes = []
        for (let j = 0; j < 9; j++) {
            const boxNotes = new Array(9)
            for (let k = 1; k <= 9; k++) {
                // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0]
                //  represenstion. but let's ignore it for now
                boxNotes[k - 1] = { noteValue: k, show: 0 }
            }
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }
    return notesInfo
}

// TODO: chamge initBoardData -> initMainNumbers
export const INITIAL_STATE = {
    mainNumbers: initMainNumbers(),
    selectedCell: { row: 0, col: 0 },
    notesInfo: initNotesInfo(),
}
