import { useEffect, useRef, useState, useCallback } from 'react'

const usePrevious = value => {
    const ref = useRef(null)
    useEffect(() => {
        ref.current = value
    }, [value])
    // Return previous value (happens before update in useEffect above)
    return ref.current
}

const useToggle = defaultValue => {
    const [value, setValue] = useState(defaultValue)

    const toggleValue = useCallback(value => {
        setValue(currentValue => (typeof value === 'boolean' ? value : !currentValue))
    }, [])

    return [value, toggleValue]
}

export { usePrevious, useToggle }