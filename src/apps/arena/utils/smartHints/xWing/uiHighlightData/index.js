import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const transformXWingRawHint = ({ rawHint: xWing, notesData }) => {
    const transformHandler = xWing.type === XWING_TYPES.PERFECT ? getPerfectXWingUIData : getFinnedXWingUIData
    return transformHandler(xWing, notesData)
}
