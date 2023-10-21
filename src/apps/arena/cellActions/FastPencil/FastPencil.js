import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'

const FastPencil = ({ iconBoxSize, onClick, ...rest }) => {
    const styles = useStyles(getStyles)
    return (
        <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
            <PencilIcon iconBoxSize={iconBoxSize} fill={styles.inactiveState.color} />
            <Text style={styles.actionText}>Fast Pencil</Text>
        </Touchable>
    )
}
export default React.memo(FastPencil)

FastPencil.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

FastPencil.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
