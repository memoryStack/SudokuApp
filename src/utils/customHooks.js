import  { useEffect, useRef } from 'react'

const usePrevious = value => {
    const ref = useRef(null)
    useEffect(() => {
      ref.current = value
    }, [value])
    // Return previous value (happens before update in useEffect above)
    return ref.current
}

export {
    usePrevious,
}
