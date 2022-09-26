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
