export type YWingCell = {
    cell: Cell
    notes: NoteValue[]
}

export type YWingRawHint = {
    pivot: YWingCell
    wings: [YWingCell, YWingCell]
    wingsCommonNote: NoteValue
}
