import { LINK_TYPES } from './xChain.constants'

export type Link = {
    start: number
    end: number
    type: LINK_TYPES
    isLast: boolean
}

export type NoteChain = Link[]

export type XChainRawHint = {
    note: NoteValue
    chain: Cell[]
    removableNotesHostCells: Cell[]
}
