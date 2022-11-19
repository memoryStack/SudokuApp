import { HOUSE_TYPE } from "../../smartHints/constants";
import { Houses } from "../houses";

describe('Houses Class', () => {
    test('isRowHouse() class method verifies if passed houseType is row or not', () => {
        expect(Houses.isRowHouse(HOUSE_TYPE.ROW)).toBeTruthy()
    })

    test('isColumnHouse() class method verifies if passed houseType is row or not', () => {
        expect(Houses.isColHouse(HOUSE_TYPE.COL)).toBeTruthy()
    })

    test('isBlockHouse() class method verifies if passed houseType is row or not', () => {
        expect(Houses.isBlockHouse(HOUSE_TYPE.BLOCK)).toBeTruthy()
    })
})
