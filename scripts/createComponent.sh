component=$1
type=$2

if [ "$type" = "molecules" ]
then folderPath="./src/ui/molecules/${component}"
elif [ "$type" = "atoms" ]
then folderPath="./src/ui/atoms/${component}"
else 
    # echo "Error: component type can be atoms or molecules" >&2
    # exit 1
    # second argument should be full path
    folderPath="${2}/${component}"
fi

mkdir $folderPath
cd $folderPath

componentSubFilesPrefix=$(echo $component | awk '{print tolower(substr($1,1,1)) substr($1,2)}')

touch index.ts
touch ${component}.tsx
touch ${componentSubFilesPrefix}.styles.ts
touch ${componentSubFilesPrefix}.constants.ts

######## above code will create files only

# add boilerplate to the index.js file
echo "export { default } from './${component}'
export * from './${componentSubFilesPrefix}.constants'" > index.ts

# add boilerplate to the .styles.js file
echo "import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({}, theme) => {
    return StyleSheet.create({

    })
}" > ${componentSubFilesPrefix}.styles.ts

#add boilerplate to component.js file

echo "import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './${componentSubFilesPrefix}.styles'

const ${component} = ({
    ...rest
}) => {
    const styles = useStyles(getStyles)

    return (
        null
    )
}

export default React.memo(${component})

${component}.propTypes = {
    
}

${component}.defaultProps = {
    
}" > ${component}.tsx
