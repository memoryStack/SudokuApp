import _head from '@lodash/head'
import _isNil from '@lodash/isNil'
import _last from '@lodash/last'

import type {
    Chain,
    ChainTerminals,
    GetNewLinksOptions,
    IsNodeAvailableToAdd,
    OnAddingNewNodeInChain,
    OnChainExplorationComplete,
    OnNodeExplorationFail,
    AnalyzedChainResult,
} from './types'

const getChainEdgeLinks = (chain: Chain): ChainTerminals => ({
    first: _head(chain),
    last: _last(chain),
})

const isChainExplorationComplete = (chain: Chain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.isLast && last.isLast
}

export const exploreChain = (
    chain: Chain,
    getNewLinksOptions: GetNewLinksOptions,
    isNodeAvailableToAdd: IsNodeAvailableToAdd,
    onAddingNewNodeInChain: OnAddingNewNodeInChain,
    onChainExplorationComplete: OnChainExplorationComplete,
    onNodeExplorationFail: OnNodeExplorationFail,
): AnalyzedChainResult | null => {
    if (!isChainExplorationComplete(chain)) {
        const { first: chainFirstLink, last: chainLastLink } = getChainEdgeLinks(chain)

        const sholdExploreFromChainEnd = !chainLastLink.isLast

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
                isLast: false,
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
                chainLastLink.isLast = true
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
                chainFirstLink.isLast = true
            }
        }
    }
    // NOTE: don't use "else" conditional block here
    if (isChainExplorationComplete(chain)) {
        const { foundChain, chainResult } = onChainExplorationComplete(chain)
        return foundChain ? chainResult : null
    }

    return null
}
