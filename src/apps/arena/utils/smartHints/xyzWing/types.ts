export type XYZWingCell = {
    cell: Cell,
    notes: NoteValue[]
}

export type XYZWingRawHint = {
    isComposite: boolean
    wingsAndPivotCommonNote: number,
    pivot: XYZWingCell,
    wings: XYZWingCell[],
    removableNoteHostCells: Cell[]
}
