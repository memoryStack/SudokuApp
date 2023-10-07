// TODO: understand more on how this declaration file is working
// and how can it be made better
declare module '@lodash/isEmpty' {
    import _isEmpty from 'lodash/isEmpty';
    export default _isEmpty;
}

declare module '@lodash/isEqual' {
    import isEqual from 'lodash/isEqual';
    export default isEqual;
}

declare module '@lodash/forEach' {
    import forEach from 'lodash/forEach';
    export default forEach;
}

declare module '@lodash/filter' {
    import filter from 'lodash/filter';
    export default filter;
}

declare module '@lodash/includes' {
    import includes from 'lodash/includes';
    export default includes;
}

declare module '@lodash/values' {
    import values from 'lodash/values';
    export default values;
}

declare module '@lodash/unique' {
    import unique from 'lodash/uniq';
    export default unique;
}

declare module '@lodash/sortNumbers' {
    import sortNumbers from 'lodash/sortBy';
    export default sortNumbers;
}

declare module '@lodash/areSameValues' {
    import areSameValues from 'lodash/isEqual';
    export default areSameValues;
}
