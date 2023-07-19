import React, { memo, useState } from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Radio from '@ui/atoms/RadioButton'
import Button, { BUTTON_TYPES } from '@ui/molecules/Button'

import { useTranslation } from '../../../i18n/hooks/useTranslation'
import { LANGAUGE_OPTIONS } from '../../../i18n/languages'

import { Touchable } from '../Touchable'

import { LANGUAGE_OPTION_TEST_ID, SELECTED_OPTION_HIGHLIGHTER_TEST_ID } from './languageSelector.constants'
import { styles } from './style'

const LanguageSelector_ = ({ hideModal }) => {
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
                    { marginTop: index ? 16 : 0 },
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

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <Button type={BUTTON_TYPES.TEXT} label={t('Cancel')} onClick={hideModal} />
            <Button type={BUTTON_TYPES.TEXT} label={t('Save')} onClick={handleSavePress} />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{t('Select a Language')}</Text>
            <View style={styles.languagesListContainer}>{getLanguagesList()}</View>
            {renderFooter()}
        </View>
    )
}

LanguageSelector_.propTypes = {
    hideModal: PropTypes.func,
}

LanguageSelector_.defaultProps = {
    hideModal: _noop,
}

export default memo(LanguageSelector_)
