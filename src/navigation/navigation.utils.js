import _get from '@lodash/get'

import { HEADER_SECTION } from './headerSection/headerSection.constants'

import { ROUTES } from './route.constants'
import { routesHeaderItems } from './routes'

export const getRouteNameFromRoute = route => _get(route, 'name', '')

export const isHomeRoute = route => getRouteNameFromRoute(route) === ROUTES.HOME

export const getHeaderRightItems = route => {
    const routeName = getRouteNameFromRoute(route)
    return _get(routesHeaderItems, [routeName, HEADER_SECTION.RIGHT], [])
}

export const getHeaderLeftItems = route => {
    const routeName = getRouteNameFromRoute(route)
    return _get(routesHeaderItems, [routeName, HEADER_SECTION.LEFT], [])
}

export const getRouteHeaderTitle = route => {
    const routeName = getRouteNameFromRoute(route)
    return _get(routesHeaderItems, [routeName, 'title'], '')
}

export const getRouteParamValue = (paramKey, route) => {
    return _get(route, ['params', paramKey], '')
}
