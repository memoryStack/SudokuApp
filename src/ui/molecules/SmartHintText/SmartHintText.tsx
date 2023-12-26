import React from 'react'

import { useNavigation } from '@react-navigation/native'

// TODO: fix this eslint error
import HtmlView from 'react-native-htmlview'

import Text from '@ui/atoms/Text'
import type { TextProps, Styles } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
// this is not particularly a dumb component, it knows about routes and navigations
import _flatten from '@lodash/flatten'
import _compact from '@lodash/compact'
import { ROUTES } from '../../../navigation/route.constants'
// TODO: fix circular dependency here, maybe write a util here (but would that help ??)
import { NAVIGATION_PARAMS as HINTS_VOCABULARY_SCREEN_PARAMS } from '../../../apps/hintsVocabulary'
import { getStyles } from './smartHintText.styles'

interface Props extends TextProps {
    text: string
}

const CustomTextComponent = ({ style, ...restProps }: { style: Styles[] }) => {
    const finalStyle = _flatten(_compact(style))
    return (
        <Text style={finalStyle} {...restProps} />
    )
}

/*
    TODO: explore https://www.npmjs.com/package/react-native-render-html
    i guess it offers a lot of cool things
*/

const SmartHintText: React.FC<Props> = ({
    text,
    ...textProps
}) => {
    const styles = useStyles(getStyles)

    const navigation = useNavigation()

    const onLinkPress = (vocabKeyword: string) => {
        // TODO: fix this 'never' issue
        navigation.navigate(ROUTES.HINTS_VOCABULARY_EXPLAINATION as never, {
            [HINTS_VOCABULARY_SCREEN_PARAMS.VOCAB_KEYWORD]: vocabKeyword,
        } as never)
    }

    return (
        <HtmlView
            value={text}
            stylesheet={styles}
            onLinkPress={onLinkPress}
            TextComponent={CustomTextComponent}
            textComponentProps={textProps}
        />
    )
}

export default React.memo(SmartHintText)
