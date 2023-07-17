/* eslint-disable no-unused-vars */
import React from 'react'

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
