import _isEqual from '@lodash/isEqual'
import _map from '@lodash/map'

import { render, screen } from '@utils/testing/testingLibrary'

// TODO: write the test-cases for this class ??
export class PersistentRender {
    // for now it stores only 2 back to back renders
    // this class name is a bit misleading bacause of that
    constructor({ getRenderingResultToCompare }) {
        this.getRenderingResult = getRenderingResultToCompare
        this.renderingResults = []
    }

    getChangedRenderingResultStatus() {
        if (this.renderingResults.length < 2) {
            throw new Error('not sufficient renders to compare')
        }

        return _map(this.renderingResults[0], (previousRenderingValue, index) => {
            const currentRenderingValue = this.renderingResults[1][index]
            return !_isEqual(previousRenderingValue, currentRenderingValue)
        })
    }

    saveTreeChangeAfterRendering() {
        this.renderingResults.push(this.getRenderingResult())
        this.renderingResults = this.renderingResults.slice(-2)
    }

    render(...props) {
        const result = render(...props)
        this.saveTreeChangeAfterRendering()
        return result
    }

    update(...props) {
        const result = screen.update(...props)
        this.saveTreeChangeAfterRendering()
        return result
    }
}
