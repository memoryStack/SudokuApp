import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './dialog.styles'

const Dialog = ({
    ...rest
}) => {
    const styles = useStyles(getStyles)

    return (
        null
    )
}

export default React.memo(Dialog)

Dialog.propTypes = {
    
}

Dialog.defaultProps = {
    
}
