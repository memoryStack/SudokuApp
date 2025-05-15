import { useMemo, useContext } from 'react'

import DependencyContext from '@contexts/DependencyContext'
import { Dependencies as ApplicationLayerDependencies } from '@application/type'
import { useRoute } from '@react-navigation/native'
import { getRouteNameFromRoute } from 'src/navigation/navigation.utils'
import { AnalyticsHandlers } from '@adapters/analytics'
import { ROUTES } from '@application/constants'
import { SoundAdapter } from 'src/interfaces/soundAdapter'
import { CoachMarksAdapterUIInterface } from 'src/interfaces/coachMarksToursAdapter'

interface Dependencies extends ApplicationLayerDependencies {
    soundAdapter: SoundAdapter
    coachMarksAdapter: CoachMarksAdapterUIInterface
}

export const useDependency = (): Dependencies => {
    const dependencies = useContext(DependencyContext)
    const route = useRoute()

    const routeName = getRouteNameFromRoute(route)

    const result = useMemo(() => {
        return {
            ...dependencies,
            analytics: AnalyticsHandlers[routeName as ROUTES]
        }
    }, [dependencies, routeName])

    return result as Dependencies
}
