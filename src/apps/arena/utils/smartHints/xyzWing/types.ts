export type XYZWingCell = {
    cell: Cell,
    notes: NoteValue[]
}

export type XYZWingRawHint = {
    wingsAndPivotCommonNote: number,
    pivot: XYZWingCell,
    wings: XYZWingCell[],
    removableNoteHostCells: Cell[]
}
