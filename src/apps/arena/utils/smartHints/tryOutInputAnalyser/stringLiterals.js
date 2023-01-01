import { XWING_TYPES } from "../xWing/constants"

export const UNATTAINABLE_TRY_OUT_STATE = 'not sure how we reached here'

export const XWING = {
    NO_INPUT: `try filling {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}}` +
        ` to understand why all {{candidate}} highlighted in red color can't come there and is safe to remove`,
    SAME_CROSSHOUSE: `now to fill {{candidate}} in {{houseAAxesValue}} and {{houseBAxesValue}}` +
        ` {{houseFullNamePlural}} we have two cells {{xWingHostCellsTexts}} but both of` +
        ` these cells are in {{crossHouse}} {{crossHouseFullName}}`,
    ONE_LEG_NO_CANDIDATE: `there is no cell in {{inhabitableHouseAxesText}} {{houseFullName}}` +
        ` where {{candidate}} can come`,
    ONE_LEG_VALID_FILL: `{{candidate}} is filled in {{houseAxesText}} {{houseFullName}} without any error, try filling it` +
        ` in other places as well where it is highlighted in red or green color`,
    BOTH_LEG_VALID_FILL: `{{candidate}} is filled in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} without error` +
        ` and all the red colored {{candidate}}s are also removed.`,
    [XWING_TYPES.PERFECT]: {
        BOTH_LEGS_WITHOUT_CANDIDATE: `there is no cell in {{houseAAxesValue}} and {{houseBAxesValue}} {{houseFullName}} where {{candidate}} can come`,
    },
}