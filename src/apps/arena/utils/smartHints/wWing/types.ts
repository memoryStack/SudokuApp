export type WWingRawHint = {
    isComposite: boolean
    nakedPairCells: Cell[],
    nakedPairNotes: NoteValue[],
    conjugateNote: NoteValue,
    conjugateHouse: House,
    removableNote: NoteValue,
    removableNoteHostCells: Cell[]
}
