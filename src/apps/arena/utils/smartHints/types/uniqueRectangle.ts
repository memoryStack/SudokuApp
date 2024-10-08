import { RawHintTransformersArgs } from '../types'

export type CellAndRemovableNotes = {
    notes: number[]
    cell: Cell
}

export type BaseURRawHint = {
    type: string
    hostCells: Cell[]
    urNotes: number[]
    cellAndRemovableNotes: CellAndRemovableNotes[]
    isComposite: boolean
}

export type UniqueRectangleTypeThreeRawHint = BaseURRawHint & {
    nakedPairCells: Cell[]
    nakedPairNotes: number[]
}

export type UniqueRectangleTypeFourRawHint = BaseURRawHint & {
    removableURNote: number,
    urNoteOmission: {
        house: House,
        note: NoteValue
    }
}

export type UniqueRectangleTypeSixRawHint = BaseURRawHint & {
    xWing: {
        candidate: number,
        houses: {
            rows: House[],
            columns: House[]
        }
    }
}

export type UniqueRectangleRawHint = BaseURRawHint | UniqueRectangleTypeThreeRawHint

export type URTransformerArgs = Omit<RawHintTransformersArgs, 'rawHint'> & { rawHint: UniqueRectangleRawHint }
