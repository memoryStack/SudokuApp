import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import withActions from "../../../utils/hocs/withActions"
import { Inputpanel } from "../inputPanel"
import { getMainNumbers } from "../store/selectors/board.selectors"
import { ACTION_HANDLERS } from "./actionHandlers"

const GameInputPanel_ = ({
    onAction
}) => {
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

    return (
        <Inputpanel numbersVisible={numbersVisible} onAction={onAction} />
    )
}

export const GameInputPanel = React.memo(withActions(ACTION_HANDLERS)(GameInputPanel_))
