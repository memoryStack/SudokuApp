import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const getUIHighlightData = (xWings, notesData) => {
    return xWings.map((xWing) => {
        if (xWing.type === XWING_TYPES.PERFECT) return getPerfectXWingUIData(xWing, notesData)
        // TODO: seperate ui-highlight logic for finned and sashimi-finned xWings
        return getFinnedXWingUIData(xWing, notesData)
    })
}
