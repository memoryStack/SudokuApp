import React, { useState, useContext, useCallback, useEffect } from 'react'
import { fetchStepCount } from './apis'

const CounterStepContext = React.createContext(1)

export const CounterStepProvider = ({ step, children }) => {

    const [steps, setSteps] = useState(step)

    useEffect(() => {
        fetchStepCount().then((step) => {
            setSteps(step)
        })
    }, [])

    useEffect(() => setSteps(step), [step])

    return (
        <CounterStepContext.Provider value={steps}>{children}</CounterStepContext.Provider>
    )
}

export function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue)
    const step = useContext(CounterStepContext)
    const increment = useCallback(() => setCount((x) => x + step), [step])
    const reset = useCallback(() => setCount(initialValue), [initialValue])
    return { count, increment, reset }
}
