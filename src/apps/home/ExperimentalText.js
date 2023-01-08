import React from 'react'

import { StyleSheet, Text } from 'react-native'

import _noop from 'lodash/src/utils/noop'

const styles = StyleSheet.create({
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
})

export const getLinkTagSubstr = (startIndex, str) => {
    let endIndex = 0
    for (let i = startIndex; i < str.length; i++) {
        if (str.substring(i, i + 4) === '</a>') {
            endIndex = i + 4
            break
        }
    }
    return str.substring(startIndex, endIndex)
}

export const getLinkTagData = tag => ({
    routeKey: tag.match(/(?<=#).*?(?=#)/i)[0],
    text: tag.match(/(?<=>).*?(?=<)/i)[0],
})

export const getTextConfig = text => {
    const result = []

    let currentStr = ''
    for (let i = 0; i < text.length; i++) {
        if (text.substring(i, i + 2) === '<a') {
            // add previous string
            if (currentStr) {
                result.push({ text: currentStr, isLink: false })
                currentStr = ''
            }

            const linkTagSubstr = getLinkTagSubstr(i, text)
            result.push({
                isLink: true,
                ...getLinkTagData(linkTagSubstr),
            })

            i += linkTagSubstr.length - 1
            continue
        }

        currentStr += text[i]
    }

    if (currentStr) result.push({ text: currentStr, isLink: false })

    return result
}

export const ExperimentalText = ({ navigation }) => {
    const onLinkPress = routeKey => {
        console.log('text pressed', routeKey)
        navigation.navigate(routeKey)
    }

    const renderExperimentalText = () => {
        const text = 'Please visit <a pageRouteKey=#somepage#>here</a>.'

        const textConfig = getTextConfig(text)

        return (
            <Text>
                {textConfig.map(({ text, isLink, routeKey }) => (
                    <Text
                        style={[isLink ? styles.link : null]}
                        onPress={isLink ? () => onLinkPress(routeKey) : _noop}
                    >
                        {text}
                    </Text>
                ))}
            </Text>
        )
    }

    return renderExperimentalText()
}

/*
    subtasks
        1. decide a format for rendering the link
*/
