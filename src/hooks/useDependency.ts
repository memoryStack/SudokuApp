import { useContext } from 'react'

import DependencyContext from '@contexts/DependencyContext'

export const useDependency = () => {
    const dependencies = useContext(DependencyContext)
    return dependencies
}
