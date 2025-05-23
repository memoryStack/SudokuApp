import React from 'react'

import { CopilotProvider } from "react-native-copilot";

import { useStyles } from '@utils/customHooks/useStyles';

import { getStyles } from './spotlightTourProvider.styles'

const SpotlightTourProvider = ({ children, ...rest }) => {

    const styles = useStyles(getStyles)

    return (
        <CopilotProvider
            customStyles={styles}
            {...rest}
        >
            {children}
        </CopilotProvider>
    )
}

export default SpotlightTourProvider
