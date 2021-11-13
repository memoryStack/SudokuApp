import React, { useRef } from 'react'
import { styles } from './styles'
import { View, Text, ScrollView } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { Touchable, TouchableTypes } from '../../components/Touchable'

const CLOSE_ICON_HITSLOP = { top: 24, left: 24, bottom: 24, right: 24 }
export default React.memo(({ title = '', logic = '', parentHeight, onSmartHintHCClosed }) => {
    const smartHintHCRef = useRef(null)

    const closeView = () => smartHintHCRef.current && smartHintHCRef.current.closeDragger(true)

    return (
        <BottomDragger
            ref={smartHintHCRef}
            stopBackgroundClickClose
            onDraggerClosed={onSmartHintHCClosed}
            parentHeight={parentHeight}
            bottomMostPositionRatio={1.1} // TODO: we can make it a default i guess
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.hintTitle}>{title}</Text>
                    <Touchable touchable={TouchableTypes.opacity} onPress={closeView} hitSlop={CLOSE_ICON_HITSLOP}>
                        <CloseIcon height={24} width={24} fill={'rgba(0, 0, 0, .8)'} />
                    </Touchable>
                </View>
                <ScrollView style={styles.logicContainer}>
                    <Text style={styles.hintLogicText}>{logic}</Text>
                </ScrollView>
            </View>
        </BottomDragger>
    )
})
