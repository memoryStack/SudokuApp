import React from 'react'
import { View } from 'react-native'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { Touchable } from '../../../apps/components/Touchable'
import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './selectablePill.styles'
import { SELECTABLE_PILL_TEST_ID } from './selectablePill.constants'

interface Props {
    label: string
    selected: boolean
    onPress: () => void
    testID?: string
}

const SelectablePill_: React.FC<Props> = ({
    label,
    selected,
    onPress,
    testID = SELECTABLE_PILL_TEST_ID,
}) => {
    const styles = useStyles(getStyles, { selected })

    return (
        <Touchable
            style={styles.container}
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            testID={testID}
        >
            {selected && (
                <View style={styles.checkIcon}>
                    <Text type={TEXT_VARIATIONS.LABEL_LARGE}>✓</Text>
                </View>
            )}
            <Text style={styles.text} type={TEXT_VARIATIONS.LABEL_LARGE}>
                {label}
            </Text>
        </Touchable>
    )
}

export default React.memo(SelectablePill_)
