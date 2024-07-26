import { MainNumbersRecord } from "@domain/board/records/mainNumbersRecord"

export const cellHasTryOutInput = (
    cell: Cell,
    { actualMainNumbers, tryOutMainNumbers }: any
) => {
    return !MainNumbersRecord.isCellFilled(actualMainNumbers, cell)
        && MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
}
