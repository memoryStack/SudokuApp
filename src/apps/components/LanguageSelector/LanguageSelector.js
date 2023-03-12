import React, { memo, useState } from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { LANGAUGE_OPTIONS } from 'src/i18n/languages'
import Radio from 'src/apps/components/Radio'
import { Button } from 'src/components/button'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

import { Touchable, TouchableTypes } from '../Touchable'
import { styles } from './style'

const LanguageSelector_ = ({ onSavePress }) => {
    const { i18n, selectedLanguage: defaultSelectedLanguage } = useTranslation()

    const [selectedLanguage, setSelectedLanguage] = useState(defaultSelectedLanguage)

    const isLanguageSelected = langKey => langKey === selectedLanguage

    const handleSavePress = () => {
        i18n.changeLanguage(selectedLanguage)
        onSavePress()
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
                // TODO: standardize the hitslops
                hitSlop={{
                    top: 16,
                    bottom: 16,
                    left: 16,
                    right: 16,
                }}
                avoidDefaultStyles
            >
                <Radio isSelected={isLanguageSelected(key)} />
                <Text style={styles.languageLable}>{label}</Text>
            </Touchable>
        ))
    )

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Select a Language
            </Text>
            <View style={styles.languagesListContainer}>
                {getLanguagesList()}
            </View>
            <Button
                text="Save"
                onClick={handleSavePress}
                avoidDefaultContainerStyles
                style={styles.saveBtnContainer}
                textStyles={styles.saveBtnText}
                hitSlop={{
                    top: 16,
                    bottom: 16,
                    left: 16,
                    right: 16,
                }}
            />
        </View>
    )
}

LanguageSelector_.propTypes = {
    onSavePress: PropTypes.func,
}

LanguageSelector_.defaultProps = {
    onSavePress: _noop,
}

export default memo(LanguageSelector_)
