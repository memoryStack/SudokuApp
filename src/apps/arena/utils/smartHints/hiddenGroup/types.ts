export type HiddenGroupRawHint = {
    isComposite: boolean
    house: House
    groupCandidates: NoteValue[] // TODO: is this number of MainNumber or NoteVale ??
    groupCells: Cell[]
}
export type GroupCandidates = HiddenGroupRawHint['groupCandidates']
export type GroupHostCells = HiddenGroupRawHint['groupCells']
export type GroupCandidate = NoteValue
export type GroupCell = Cell
