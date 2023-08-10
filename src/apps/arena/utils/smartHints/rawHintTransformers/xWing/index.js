import { XWING_TYPES } from '../../xWing/constants'
import { getFinnedXWingUIData } from './transformers/finnedXWing'
import { getPerfectXWingUIData } from './transformers/perfectXWing'

export const transformXWingRawHint = ({ rawHint: xWing, notesData, smartHintsColorSystem }) => {
    const transformHandler = xWing.type === XWING_TYPES.PERFECT ? getPerfectXWingUIData : getFinnedXWingUIData
    return transformHandler(xWing, notesData, smartHintsColorSystem)
}
