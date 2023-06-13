import React, { memo, useState } from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Radio from '@ui/atoms/RadioButton'

import { LANGAUGE_OPTIONS } from 'src/i18n/languages'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import { Touchable, TouchableTypes } from '../Touchable'

import { styles } from './style'

const LanguageSelector_ = ({ hideModal }) => {
    const { i18n, selectedLanguage: defaultSelectedLanguage } = useTranslation()

    const [selectedLanguage, setSelectedLanguage] = useState(defaultSelectedLanguage)

    const isLanguageSelected = langKey => langKey === selectedLanguage

    const handleSavePress = () => {
        i18n.changeLanguage(selectedLanguage)
        hideModal()
    }

    // TODO: this radio buttons list can be a separate
    // independent component, plan to move it
    const getLanguagesList = () => (
        LANGAUGE_OPTIONS.map(({ key, label }, index) => (
            <Touchable
                touchable={TouchableTypes.opacity}
                key={key}
                style={[
                    styles.languageItemContainer,
                    { marginTop: index ? 16 : 0 },
                ]}
                onPress={() => setSelectedLanguage(key)}
                addHitSlop
                avoidDefaultStyles
            >
                <Radio isSelected={isLanguageSelected(key)} />
                <Text style={styles.languageLable}>{label}</Text>
            </Touchable>
        ))
    )

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <Button type={BUTTON_TYPES.TEXT} label="Cancel" onClick={hideModal} />
            <Button type={BUTTON_TYPES.TEXT} label="Save" onClick={handleSavePress} />
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Select a Language
            </Text>
            <View style={styles.languagesListContainer}>
                {getLanguagesList()}
            </View>
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
