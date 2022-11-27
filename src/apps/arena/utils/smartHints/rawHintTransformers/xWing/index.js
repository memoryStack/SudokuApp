
import { XWING_TYPES } from '../../xWing/constants'
import { getFinnedXWingUIData } from './transformers/finnedXWing'
import { getPerfectXWingUIData } from './transformers/perfectXWing'

export const transformXWingRawHint = ({ rawHint: xWing, notesData }) => {
    const transformHandler = xWing.type === XWING_TYPES.PERFECT ? getPerfectXWingUIData : getFinnedXWingUIData
    return transformHandler(xWing, notesData)
}
