import _head from '@lodash/head'
import _includes from '@lodash/includes'
import _last from '@lodash/last'
import _map from '@lodash/map'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'

import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../cellTransformers'
import { getCellsSharingHousesWithCells } from '../../util'

import type {
    Link, ChainTerminals, Chain, CellNumber,
} from './chainExplorer'

export const getChainEdgeLinks = (chain: Chain): ChainTerminals => ({
    first: _head(chain),
    last: _last(chain),
})

export const getChainCellsNumbers = (chain: Chain): CellNumber[] => {
    const result = _map(chain, (link: Link) => link.start)
    result.push(getChainEdgeLinks(chain).last.end)
    return result
}

export const getChainCells = (chain: Chain) => getChainCellsNumbers(chain)
    .map(cellNumber => convertBoardCellNumToCell(cellNumber))

export const getRemovableNotesHostCellsByChain = (
    note: NoteValue,
    chain: Chain,
    notes: Notes,
) => {
    const chainCells = getChainCellsNumbers(chain)
    const { first, last } = getChainEdgeLinks(chain)
    const chainFirstCell = convertBoardCellNumToCell(first.start)
    const chainLastCell = convertBoardCellNumToCell(last.end)
    return getCellsSharingHousesWithCells(chainFirstCell, chainLastCell)
        .filter(cell => !_includes(chainCells, convertBoardCellToNum(cell)))
        .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell))
}
