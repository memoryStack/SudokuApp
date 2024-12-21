import PropTypes from 'prop-types'

const AnimationConfig = PropTypes.shape({
    toValue: PropTypes.number,
    duration: PropTypes.number,
    useNativeDriver: PropTypes.bool,
})

const AnimationLoopConfig = PropTypes.shape({
    iterations: PropTypes.number,
})

const CommonAnimationProps = {
    config: AnimationConfig,
    loopConfig: AnimationLoopConfig,
    resetToPrevious: PropTypes.bool,
    stop: PropTypes.bool,
}

const ColorAnimationConfig = PropTypes.shape({
    ...CommonAnimationProps,
    output: PropTypes.arrayOf(PropTypes.string),
})

export const ViewAnimationConfig = PropTypes.shape({
    fontSize: CommonAnimationProps,
    borderWidth: CommonAnimationProps,
    borderColor: ColorAnimationConfig,
    textColor: ColorAnimationConfig,
})

/*
    example of the animation object for a view

    const config = {
        'fontSize': {
            config: { toValue: 1.5, duration: 2000, useNativeDriver: true }
        },
        'borderWidth': {
            config: { toValue: 3, duration: 1000, useNativeDriver: false },
        },
        'borderColor': {
            config: { toValue: 1, duration: 2000, useNativeDriver: false, },
            output: ['#000000', '#ff0000']
        },
        'fontSize': {
            config: { duration: 2000 },
            stop: true
        },
        'fontSize': {
            config: { duration: 2000 },
            resetToPrevious: true
        },
        'textColor': {
            config: { toValue: 1, duration: 500, useNativeDriver: false, },
            loopConfig: {
                iterations: 3,
            },
            output: ['#000000', '#ff0000']
        }
    }

*/