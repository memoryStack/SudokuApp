import React from 'react'

import { CopilotProvider } from "react-native-copilot";

import { useStyles } from '@utils/customHooks/useStyles';

import { getStyles } from './spotlightTourProvider.styles'

const SpotlightTourProvider = ({ children }) => {

    const styles = useStyles(getStyles)

    return (
        <CopilotProvider customStyles={styles}>
            {children}
        </CopilotProvider>
    )
}

export default SpotlightTourProvider
