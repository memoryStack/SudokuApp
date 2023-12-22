import React from 'react'

// TODO: fix this eslint error
import HtmlView from 'react-native-htmlview'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text from '@ui/atoms/Text'
import type { TextProps } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './smartHintText.styles'
import { useNavigation } from '@react-navigation/native'
import { ROUTES } from 'src/navigation/route.constants'

interface Props extends TextProps {
    text: string
}   

const SmartHintText: React.FC<Props> = ({
    text,
    ...textProps
}) => {
    const styles = useStyles(getStyles)
    
    const navigation = useNavigation()
    
    const onLinkPress = (url: string) => {
        // TODO: fix this 'never' issue
        navigation.navigate( ROUTES.HINTS_VOCABULARY_EXPLAINATION as never, { vocabKeyword: url } as never)
    }

    return (
        <HtmlView
            value={text}
            stylesheet={styles}
            onLinkPress={ onLinkPress}
            TextComponent={Text}
            textComponentProps={textProps}
        />
    )
}

export default React.memo(SmartHintText)

SmartHintText.propTypes = {

}

SmartHintText.defaultProps = {

}
