import { URTransformerArgs } from '../../types/uniqueRectangle'
import { TransformedRawHint } from '../../types'
import { URTypeChecker } from '../../uniqueRectangle/helpers'

import { transformURTypeOne } from './uniqueRectangleTypeOne'
import { transformURTypeTwo } from './uniqueRectangleTypeTwo'
import { transformURTypeThree } from './uniqueRectangleTypeThree'
import { transformURTypeFour } from './uniqueRectangleTypeFour'
import { transformURTypeFive } from './uniqueRectangleTypeFive'
import { transformURTypeSix } from './uniqueRectangleTypeSix'
import { HINT_ID_VS_TITLES } from '../../stringLiterals'
import { HINTS_IDS } from '../../constants'

export const transformURRawHint = (args: URTransformerArgs): TransformedRawHint => {
    let result: TransformedRawHint = {}

    if (URTypeChecker.isURTypeOne(args.rawHint)) result = transformURTypeOne(args)
    if (URTypeChecker.isURTypeTwo(args.rawHint)) result = transformURTypeTwo(args)
    if (URTypeChecker.isURTypeThree(args.rawHint)) result = transformURTypeThree(args)
    if (URTypeChecker.isURTypeFour(args.rawHint)) result = transformURTypeFour(args)
    if (URTypeChecker.isURTypeFive(args.rawHint)) result = transformURTypeFive(args)
    if (URTypeChecker.isURTypeSix(args.rawHint)) result = transformURTypeSix(args)


    result.type = HINTS_IDS.UNIQUE_RECTANGLE
    result.title = HINT_ID_VS_TITLES[HINTS_IDS.UNIQUE_RECTANGLE]

    return result
}
