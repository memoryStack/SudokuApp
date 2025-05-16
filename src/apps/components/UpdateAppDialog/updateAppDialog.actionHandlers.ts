import { Linking } from 'react-native'

import { Platform } from '@utils/classes/platform'

import { DialogBody as UpdateAppDialogBody } from './components/UpdateAppDialogBody'

const onInit = async ({ params: {
    dependencies, modalContextValues
} }) => {
    /* call backend api and check if any update is available or not */

    const { showModal, hideModal } = modalContextValues

    const featuresList = [
        'Fixed Bugs',
        'Unlocked all puzzles',
        'Fixed Memory Leaks'
    ]

    const isMandatoryUpdate = false

    showModal({
        closeOnBackdropClick: !isMandatoryUpdate,
        Component: UpdateAppDialogBody,
        props: {
            features: featuresList,
            cancellable: !isMandatoryUpdate,
            onCancelPress: hideModal,
            onUpdatePress,
        },
    })
}

const onUpdatePress = async () => {
    // TODO: get it from BuildModule
    const APP_PACKAGE_NAME = 'com.sudokunative.release'

    try {
        if (Platform.isAndroid()) {
            await Linking.openURL(`market://details?id=${APP_PACKAGE_NAME}`);
        } else {
            await Linking.openURL(`itms-apps://itunes.apple.com/app/idYOUR_APP_ID`);
        }
    } catch (error) {
        try {
            if (Platform.isAndroid()) {
                await Linking.openURL(`https://play.google.com/store/apps/details?id=${APP_PACKAGE_NAME}`)
            } else {
                await Linking.openURL('https://apps.apple.com/app/idYOUR_APP_ID')
            }
        } catch (webError) {
        }
    }
}

const ACTION_TYPES = {
    ON_INIT: 'ON_INIT',
    ON_UPDATE_PRESS: 'ON_UPDATE_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: onInit,
    [ACTION_TYPES.ON_UPDATE_PRESS]: onUpdatePress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
