import _map from '@lodash/map'

import { URTransformerArgs, BaseURRawHint, CellAndRemovableNotes } from '../../types/uniqueRectangle'
import { URTypeChecker } from '../../uniqueRectangle/helpers'
import { TransformedRawHint, NotesRemovalHintAction } from '../../types'
import { BOARD_MOVES_TYPES } from '../../../../constants'

import { transformURTypeOne } from './uniqueRectangleTypeOne'
import { transformURTypeTwo } from './uniqueRectangleTypeTwo'
import { transformURTypeThree } from './uniqueRectangleTypeThree'
import { transformURTypeFour } from './uniqueRectangleTypeFour'
import { transformURTypeFive } from './uniqueRectangleTypeFive'
import { transformURTypeSix } from './uniqueRectangleTypeSix'
import { HINTS_IDS } from '../../constants'

const getApplyHintData = (ur: BaseURRawHint): NotesRemovalHintAction[] => {
    return _map(ur.cellAndRemovableNotes, (cellRemovableNotes: CellAndRemovableNotes) => {
        return {
            cell: cellRemovableNotes.cell,
            action: { type: BOARD_MOVES_TYPES.REMOVE, notes: cellRemovableNotes.notes },
        }
    })
}

export const transformURRawHint = (args: URTransformerArgs): TransformedRawHint => {
    let result: TransformedRawHint = {}

    const { rawHint } = args
    if (URTypeChecker.isURTypeOne(rawHint)) result = transformURTypeOne(args)
    if (URTypeChecker.isURTypeTwo(rawHint)) result = transformURTypeTwo(args)
    if (URTypeChecker.isURTypeThree(rawHint)) result = transformURTypeThree(args)
    if (URTypeChecker.isURTypeFour(rawHint)) result = transformURTypeFour(args)
    if (URTypeChecker.isURTypeFive(rawHint)) result = transformURTypeFive(args)
    if (URTypeChecker.isURTypeSix(rawHint)) result = transformURTypeSix(args)

    result.type = HINTS_IDS.UNIQUE_RECTANGLE
    if (!result.applyHint) result.applyHint = getApplyHintData(rawHint)

    return result
}
