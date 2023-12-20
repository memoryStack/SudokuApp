import _cloneDeep from '@lodash/cloneDeep'
import _isNil from '@lodash/isNil'

import { getChainEdgeLinks } from '../chainUtils'

import type {
    Chain,
    GetNewLinksOptions,
    IsNodeAvailableToAdd,
    OnAddingNewNodeInChain,
    OnChainExplorationComplete,
    OnNodeExplorationFail,
    AnalyzedChainResult,
} from './types'

const isChainExplorationComplete = (chain: Chain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.isTerminal && last.isTerminal
}

export const exploreChain = (
    _chain: Chain,
    getNewLinksOptions: GetNewLinksOptions,
    isNodeAvailableToAdd: IsNodeAvailableToAdd,
    onAddingNewNodeInChain: OnAddingNewNodeInChain,
    onChainExplorationComplete: OnChainExplorationComplete,
    onNodeExplorationFail: OnNodeExplorationFail,
): AnalyzedChainResult | null => {
    const chain = _cloneDeep(_chain)
    if (!isChainExplorationComplete(chain)) {
        const { first: chainFirstLink, last: chainLastLink } = getChainEdgeLinks(chain)

        const sholdExploreFromChainEnd = !chainLastLink.isTerminal

        const { newLinkPossibleCells } = getNewLinksOptions(chain, sholdExploreFromChainEnd)

        const newLinkConnectingCellInChain = sholdExploreFromChainEnd ? chainLastLink.end : chainFirstLink.start
        let chainProgressed = false
        for (let i = 0; i < newLinkPossibleCells.length; i++) {
            const { node: newLinkCell, type: newLinkType } = newLinkPossibleCells[i]

            if (!isNodeAvailableToAdd(newLinkCell)) continue

            onAddingNewNodeInChain(newLinkCell)

            chainProgressed = true

            const newLinkPositionInChain = sholdExploreFromChainEnd ? chain.length : 0
            const chainWithNewLink = [...chain]
            // no util found for splice in lodash, use this one only for now
            // add new link in chain and recurse for more exploration
            chainWithNewLink.splice(newLinkPositionInChain, 0, {
                start: sholdExploreFromChainEnd ? newLinkConnectingCellInChain : newLinkCell,
                end: sholdExploreFromChainEnd ? newLinkCell : newLinkConnectingCellInChain,
                type: newLinkType,
                isTerminal: false,
            })

            const chainInfo = exploreChain(
                chainWithNewLink,
                getNewLinksOptions,
                isNodeAvailableToAdd,
                onAddingNewNodeInChain,
                onChainExplorationComplete,
                onNodeExplorationFail,
            )
            if (!_isNil(chainInfo)) return chainInfo

            onNodeExplorationFail(newLinkCell)
        }

        if (!chainProgressed) {
            if (sholdExploreFromChainEnd) {
                chainLastLink.isTerminal = true
                const chainInfo = exploreChain(
                    chain,
                    getNewLinksOptions,
                    isNodeAvailableToAdd,
                    onAddingNewNodeInChain,
                    onChainExplorationComplete,
                    onNodeExplorationFail,
                )
                if (!_isNil(chainInfo)) return chainInfo
            } else {
                chainFirstLink.isTerminal = true
            }
        }
    }
    // NOTE: don't use "else" conditional block here
    // NOTE: chains with only 1 node and that can't be progressed are getting ananlyzed
    //      2 times, saw this issue in XY-Chains hint
    if (isChainExplorationComplete(chain)) {
        const { foundChain, chainResult } = onChainExplorationComplete(chain)
        return foundChain ? chainResult : null
    }

    return null
}
