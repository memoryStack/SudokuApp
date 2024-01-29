export type HostHouse = {
    row: number,
    column: number,
    block: number,
}

export type EmptyRectangleRawHint = {
    note: NoteValue,
    conjugateHouse: House,
    hostHouse: HostHouse,
    removableNotesHostCell: Cell
}
