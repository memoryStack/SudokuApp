import { useState, useCallback } from 'react'

export const useToggle = (defaultValue = false) => {
    const [value, setValue] = useState(defaultValue)

    const toggleValue = useCallback(newValue => {
        setValue(currentValue => (typeof newValue === 'boolean' ? newValue : !currentValue))
    }, [])

    return [value, toggleValue]
}
