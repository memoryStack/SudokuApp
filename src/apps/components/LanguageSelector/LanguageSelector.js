import React, { memo, useState } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Radio from '@ui/atoms/RadioButton'
import Text from '@ui/atoms/Text'
import Dialog from '@ui/molecules/Dialog'

import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../../i18n/hooks/useTranslation'
import { LANGAUGE_OPTIONS } from '../../../i18n/languages'

import { Touchable } from '../Touchable'

import { LANGUAGE_OPTION_TEST_ID, SELECTED_OPTION_HIGHLIGHTER_TEST_ID } from './languageSelector.constants'
import { getStyles } from './languageSelector.styles'

const LanguageSelector_ = ({ hideModal }) => {
    const styles = useStyles(getStyles)

    const { t, i18n, selectedLanguage: defaultSelectedLanguage } = useTranslation()

    const [selectedLanguage, setSelectedLanguage] = useState(defaultSelectedLanguage)

    const isLanguageSelected = langKey => langKey === selectedLanguage

    const handleSavePress = () => {
        i18n.changeLanguage(selectedLanguage)
        hideModal()
    }

    const getLanguagesList = () => (
        LANGAUGE_OPTIONS.map(({ key, label }, index) => (
            <Touchable
                key={key}
                style={[
                    styles.languageItemContainer,
                    index ? styles.languageItemsGap : null,
                ]}
                onPress={() => setSelectedLanguage(key)}
                addHitSlop
                avoidDefaultStyles
                testID={LANGUAGE_OPTION_TEST_ID[key]}
            >
                <Radio
                    testID={SELECTED_OPTION_HIGHLIGHTER_TEST_ID}
                    isSelected={isLanguageSelected(key)}
                />
                <Text style={styles.languageLable}>{label}</Text>
            </Touchable>
        ))
    )

    const languagesOptionsView = <View style={styles.languagesListContainer}>{getLanguagesList()}</View>

    return (
        <Dialog
            styles={styles.container}
            title={t('Select a Language')}
            body={languagesOptionsView}
            footerButtonsConfig={[
                {
                    label: t('Cancel'),
                    onClick: hideModal,
                },
                {
                    label: t('Save'),
                    onClick: handleSavePress,
                },
            ]}
        />
    )
}

LanguageSelector_.propTypes = {
    hideModal: PropTypes.func,
}

LanguageSelector_.defaultProps = {
    hideModal: _noop,
}

export default memo(LanguageSelector_)
