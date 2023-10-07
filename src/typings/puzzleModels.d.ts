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

type Note = {
    noteValue: number
    show: number
}

// i find Array<T> more obvious than CellMainNumber[][] syntax
type MainNumbers = Array<Array<MainNumber>>

type Notes = Array<Array<Array<Note>>>

// TODO: add literal type here like "row | col | block"
// figure out a better way to expose sub-types
type HouseType = string
type HouseNum = number
type House = {
    type: HouseType
    num: HouseNum
}
