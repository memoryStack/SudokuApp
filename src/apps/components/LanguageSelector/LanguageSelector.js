import React, {
    memo, useCallback, useContext, useEffect, useRef, useState,
} from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { DEFAULT_SELECTED_LANGUAGE, LANGAUGE_OPTIONS } from 'src/i18n/languages'
import Radio from 'src/apps/components/Radio'
import { Button } from 'src/components/button'

import { consoleLog } from '@utils/util'
import { styles } from './style'
import { Touchable, TouchableTypes } from '../Touchable'

const LanguageSelector_ = ({
    onSavePress,
}) => {
    // TODO: write a hook which will tell current selected language
    //      when app loads

    const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_SELECTED_LANGUAGE)

    const isLanguageSelected = langKey => langKey === selectedLanguage

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
                hitSlop={{
                    top: 16,
                    bottom: 16,
                    left: 16,
                    right: 16,
                }}
                avoidDefaultStyles
            >
                <Radio isSelected={isLanguageSelected(key)} />
                {/* TODO: add text styles here */}
                <Text style={styles.languageLable}>{label}</Text>
                {/* </View> */}
            </Touchable>
        ))
    )

    return (
        // TODO: try with proper view now
        // make it scrollable
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Select a Language
            </Text>
            <View style={styles.languagesListContainer}>
                {getLanguagesList()}
            </View>
            {/* TODO: render save button as well here */}
            <Button
                text="Save"
                onClick={onSavePress}
                avoidDefaultContainerStyles
                style={styles.saveBtnContainer}
                textStyles={styles.saveBtnText}
            //  textStyles={styles.footerButtonText}
            //  hitSlop={HITSLOP}
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
