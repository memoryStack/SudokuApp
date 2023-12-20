import { LINK_TYPES } from '../xChain/xChain.constants'

export type CellNumber = number
export type Link = {
    start: CellNumber
    end: CellNumber
    type: LINK_TYPES
    isTerminal: boolean
}

export type Chain = Link[]

export type AnalyzedChainResult = {
    chain: Chain
    removableNotesHostCells: Cell[]
}

export type ChainTerminals = {
    first: Link
    last: Link
}

export type OnChainExplorationComplete = (chain: Chain) => {
    foundChain: boolean
    chainResult: AnalyzedChainResult | null
}

export type NewLinkPossibleCells = {
    node: CellNumber
    type : LINK_TYPES
}

export type GetNewLinksOptions = (chain: Chain, sholdExploreFromChainEnd: boolean) => {
    newLinkPossibleCells: NewLinkPossibleCells[]
}

// will be called when a node exploration is failed
// at this time we may want to mark some nodes unvisited
// to explore them in another chains
export type OnNodeExplorationFail = (chainNode: CellNumber) => void

export type IsNodeAvailableToAdd = (chainNode: CellNumber) => boolean

export type OnAddingNewNodeInChain = (node: CellNumber) => void
