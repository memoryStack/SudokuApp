import { within } from '@utils/testing/testingLibrary'
import { TEST_IDS } from './radioButton.constants'

// small testing util for components which
// are using radioButton to highlght their options.
// this was added with the intention that radio's integration is done
// properly or not in bigger components
export const isRadioSelected = element => !!within(element).queryByTestId(TEST_IDS.INNER_DOT)
