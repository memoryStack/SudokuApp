import React, { memo } from 'react'

import { View } from 'react-native'

import _noop from '@lodash/noop'

import LevelCard, { LEVEL_STATES } from '@ui/atoms/LevelCard'

import { styles } from './levelCard.styles'

const DividerDemo = () => {
    const renderGap = () => (
        <View style={{
            width: 100,
            height: 40,
            backgroundColor: 'transparent',
        }}
        />
    )

    return (
        <View style={styles.container}>
            {renderGap()}
            <LevelCard
                state={LEVEL_STATES.COMPLETED}
                levelNum={283}
                activeStars={2}
            />
            {renderGap()}
            <LevelCard state={LEVEL_STATES.LOCKED} levelNum={283} />
            {renderGap()}
            <LevelCard state={LEVEL_STATES.UNLOCKED} levelNum={283} />
        </View>
    )
}

export default memo(DividerDemo)
