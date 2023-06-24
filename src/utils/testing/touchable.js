// TODO: this should move to Touchable.js file, will do that later
import _isNil from '@lodash/isNil'

// don't use _get here so that tests fail when the implementation changes in future.
// we have to do it like this because Touchables add some props to their children
// even if their children is null like <Touchable>{null}</Touchable>
export const isEmptyElement = element => _isNil(element.props.children[0])
