import { XWING_TYPES, LEG_TYPES } from './constants'

export type XWingLeg = {
    candidate: NoteValue
    cells: Cell[]
    type: LEG_TYPES
}

export type XWingRawHint = {
    isComposite: boolean
    houseType: HouseType
    type: XWING_TYPES
    legs: XWingLeg[]
}
export type XWingLegs = XWingRawHint['legs']

export type SashimiXWingPerfectLegCellsCategories = {
    perfectAligned: Cell
    sashimiAligned: Cell
}

export type FinnedLegCellsCategories = {
    perfect: Cell[]
    finns: Cell[]
}
