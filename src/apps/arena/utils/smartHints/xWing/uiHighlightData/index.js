import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const getUIHighlightData = ({ rawHint: xWing, notesData }) => {
    const getUIDataHandler = xWing.type === XWING_TYPES.PERFECT ? getPerfectXWingUIData : getFinnedXWingUIData
    return getUIDataHandler(xWing, notesData)
}
