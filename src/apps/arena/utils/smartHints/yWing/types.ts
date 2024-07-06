export type YWingCell = {
    cell: Cell
    notes: NoteValue[]
}

export type YWingRawHint = {
    isComposite: boolean
    pivot: YWingCell
    wings: [YWingCell, YWingCell]
    wingsCommonNote: NoteValue
}
