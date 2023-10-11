type Cell = {
    row: number
    col: number
}

// TODO: how to use the types of sub properties for these objects ?
// like somewhere you pass MainNumber.value and instead of putting "number"
// in the argument, you pass the type which is defined in here
type MainNumber = {
    value: number
    solutionValue: number
    isClue: boolean
}
type MainNumberValue = MainNumber['value']

type CustomPuzzleMainNumber = MainNumber & {
    wronglyPlaced: boolean
}

type Note = {
    noteValue: number
    show: number
}
type NoteValue = Note['noteValue']

// i find Array<T> more obvious than CellMainNumber[][] syntax
type MainNumbers = Array<Array<MainNumber>>

type CustomPuzzleMainNumbers = Array<Array<CustomPuzzleMainNumber>>

type Notes = Array<Array<Array<Note>>>

// TODO: add literal type here like "row | col | block"
type House = {
    type: string
    num: number
}
type HouseType = House['type']
type HouseNum = House['num']
