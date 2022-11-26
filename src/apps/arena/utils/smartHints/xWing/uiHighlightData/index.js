import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const getUIHighlightData = ({ rawHints, notesData }) => {
    return rawHints.map(xWing => {
        const getUIDataHandler = xWing.type === XWING_TYPES.PERFECT ? getPerfectXWingUIData : getFinnedXWingUIData
        return getUIDataHandler(xWing, notesData)
    })
}
