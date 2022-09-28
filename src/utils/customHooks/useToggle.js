import { useState, useCallback } from 'react'

export const useToggle = (defaultValue = false) => {
    const [value, setValue] = useState(defaultValue)

    const toggleValue = useCallback(value => {
        setValue(currentValue => (typeof value === 'boolean' ? value : !currentValue))
    }, [])

    return [value, toggleValue]
}
