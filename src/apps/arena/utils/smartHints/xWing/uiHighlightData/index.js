import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const getUIHighlightData = (xWings, notesData) => {
    return xWings.map(({ type, houseType, legs }) => {
        if (type === XWING_TYPES.PERFECT) return getPerfectXWingUIData({ houseType, legs }, notesData)
        // TODO: seperate ui-highlight logic for finned and sashimi-finned xWings
        return getFinnedXWingUIData({ type, houseType, legs }, notesData)
    })
}
