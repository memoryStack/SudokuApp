
// TODO: move to arena utils and write test cases for it
// TODO: check if here solutionValue can be 0 instead of empty string
// TODO: remove it from this utils file to arena utils or to board/utils. that's the right plae for it.
export const initMainNumbers = () => {
    const sudokuBoard = new Array(9)
    // BOARD_LOOPER: 14
    for (let i = 0; i < 9; i++) {
        const rowData = new Array(9)
        for (let j = 0; j < 9; j++) {
            rowData[j] = { value: 0, solutionValue: '', isClue: 0 }
        }
        sudokuBoard[i] = rowData
    }
    return sudokuBoard
}

// TODO: move to arena utils
// TODO: write a test case that this func shouldn't change anything in input
export const getBlockAndBoxNum = cell => {
    const { row, col } = cell
    const blockNum = row - (row % 3) + (col - (col % 3)) / 3
    const boxNum = (row % 3) * 3 + (col % 3)
    return { blockNum, boxNum }
}

// TODO: move to arena utils
export const getRowAndCol = (blockNum, boxNum) => {
    const addToRow = (boxNum - (boxNum % 3)) / 3
    const row = blockNum - (blockNum % 3) + addToRow
    const col = (blockNum % 3) * 3 + (boxNum % 3)
    return { row, col }
}

export const rgba = function (hex, opacity) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const result = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    return result
}

// prototypes to the array
if (Array.prototype.allValuesSame === undefined) {
    Array.prototype.allValuesSame = function () {
        for (let i = 1; i < this.length; i++) {
            if (this[i] !== this[0]) {
                return false
            }
        }
        return true
    }
}

// TODO: change naming
if (Array.prototype.sameArrays === undefined) {
    Array.prototype.sameArrays = function (arrayB) {
        if (this.length !== arrayB.length) return false
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== arrayB[i]) {
                return false
            }
        }
        return true
    }
}

export const consoleLog = (...args) => {
    __DEV__ && console.log(...args)
}

// TODO: fix it as per my requirements
function noWhiteSpace(strings, ...placeholders) {
    let withSpace = strings.reduce((result, string, i) => result + placeholders[i - 1] + string)
    let withoutSpace = withSpace.replace(/$\n^\s*/gm, ' ')
    return withoutSpace
}

export const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index
}
