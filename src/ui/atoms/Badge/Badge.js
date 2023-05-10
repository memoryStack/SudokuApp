import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import { useStyles } from '@utils/customHooks/useStyles'

import { BADGE_TYPE } from './badge.constants'
import { getStyles } from './badge.styles'

// import Text from '../Text' // TODO: how to use this ??

/*
    How to use this properly
        <View style={{  // this view will bind the icon and the badge together
            marginTop: 40,
            borderWidth: 2,
            borderColor: 'black',
        }}>
            // this view will decide the layout sizing, it will be an Icon/Image
            // or some other view which will have the badge over it
            <View style={{ height: 32,width: 32 }} />

            // this is absolutely positioned anyway
            <Badge label="99999+" />
        </View>

        Note: the view which is binding Icon/Image should be not limited for space
            else the Badge will shrink and won't be able to expand properly
        TODO: this demands a research if an absolutely positioned element can be
        intrinsicly(without height/width set) wider than it's containing block.
*/

const Badge = ({
    type,
    label,
}) => {
    const styles = useStyles(getStyles, { type })

    return (
        <Text style={[styles.label, styles.container]}>
            {type === BADGE_TYPE.SMALL ? '' : label}
        </Text>
    )
}

export default React.memo(Badge)

Badge.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
}

Badge.defaultProps = {
    type: BADGE_TYPE.LARGE,
    label: '',
}
