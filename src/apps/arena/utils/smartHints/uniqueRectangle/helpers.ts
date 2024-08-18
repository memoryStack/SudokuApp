import { UniqueRectangleRawHint } from "../types/uniqueRectangle";
import { UR_TYPES } from "./constants";

export const URTypeChecker = {
    isURTypeOne: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_ONE,
    isURTypeTwo: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_TWO,
    isURTypeThree: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_THREE,
    isURTypeFour: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_FOUR,
    isURTypeFive: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_FIVE,
    isURTypeSix: (ur: UniqueRectangleRawHint) => ur.type === UR_TYPES.TYPE_SIX
}
