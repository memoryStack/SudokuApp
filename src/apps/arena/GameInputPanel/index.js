import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Inputpanel } from "../inputPanel"
import { getMainNumbers } from "../store/selectors/board.selectors"

const InputPanelContainer_ = () => {
    const mainNumbers = useSelector(getMainNumbers)
    const [numbersVisible, setNumbersVisibility] = useState(new Array(10).fill(true))

    useEffect(() => {
        const instancesCountAfterUpdate = new Array(10).fill(0)
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const value = mainNumbers[row][col].value
                instancesCountAfterUpdate[value]++
            }
        }

        const numbersVisibilityStatusAfterUpdate = [false]
        for (let i = 1; i <= 9; i++) {
            numbersVisibilityStatusAfterUpdate.push(instancesCountAfterUpdate[i] !== 9)
        }

        for (let i = 1; i <= 9; i++) {
            if (numbersVisible[i] !== numbersVisibilityStatusAfterUpdate[i]) {
                setNumbersVisibility(numbersVisibilityStatusAfterUpdate)
                break
            }
        }
    }, [mainNumbers, numbersVisible])

    // TODO: change the logic to send an array of true and false only
    return (
        <Inputpanel numbersVisible={numbersVisible} />
    )
}

export const GameInputPanel = React.memo(InputPanelContainer_)
