// TODO: understand more on how this declaration file is working
// and how can it be made better
declare module '@lodash/isEmpty' {
    import _isEmpty from '@lodash/isEmpty'

    export default _isEmpty
}

declare module '@lodash/isEqual' {
    import isEqual from '@lodash/isEqual'

    export default isEqual
}

declare module '@lodash/forEach' {
    import forEach from '@lodash/forEach'

    export default forEach
}

declare module '@lodash/filter' {
    import filter from '@lodash/filter'

    export default filter
}

declare module '@lodash/includes' {
    import includes from '@lodash/includes'

    export default includes
}

declare module '@lodash/values' {
    import values from '@lodash/values'

    export default values
}

declare module '@lodash/unique' {
    import unique from '@lodash/unique'

    export default unique
}

declare module '@lodash/sortNumbers' {
    import sortNumbers from '@lodash/sortNumbers'

    export default sortNumbers
}

declare module '@lodash/areSameValues' {
    import areSameValues from '@lodash/isEqual'

    export default areSameValues
}

declare module '@lodash/isNil' {
    import isNil from '@lodash/isNil'

    export default isNil
}

declare module '@lodash/get' {
    import get from '@lodash/get'

    export default get
}

declare module '@lodash/noop' {
    import noop from '@lodash/noop'

    export default noop
}

declare module '@lodash/set' {
    import set from '@lodash/set'

    export default set
}

declare module '@lodash/isArray' {
    import isArray from '@lodash/isArray'

    export default isArray
}

declare module '@lodash/dynamicInterpolation' {
    import { dynamicInterpolation } from '@lodash/dynamicInterpolation'

    export { dynamicInterpolation }
}

declare module '@lodash/find' {
    import _find from '@lodash/find'

    export default _find
}
