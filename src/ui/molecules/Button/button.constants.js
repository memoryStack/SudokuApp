const BUTTON_TYPES = {
    FILLED: 'filled',
    TONAL: 'tonal',
    TEXT: 'text',
    /*
        elevated
        contained
    */
}

const BUTTON_STATES = {
    ENABLED: 'enabled',
    DISABLED: 'disabled',
}

// TODO: not getting used anywhere, look for use-cases and add tokens
//          for sizes as well
const BUTTON_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const HIT_SLOP = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
}

export {
    BUTTON_STATES,
    BUTTON_TYPES,
    BUTTON_SIZES,
    HIT_SLOP,
}
