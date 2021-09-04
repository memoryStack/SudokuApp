
/**
 * this file should be broken down. most of the functions are used by Arena so 
 * these should be there not in global utils
 */

let sudokuSolution
let highlightedSinglesInfo = []
const notesInstancesPlacesInfo = {}
const duplicacyCheckerStore = {}
let notesData
let sudokuBoard

export const sameHouseAsSelected = (row, col, selectedBoxRow, selectedBoxCol) => {
	if (row === selectedBoxRow || col === selectedBoxCol) return true
	const normalBoxBlockInfo = getBlockAndBoxNum(row, col)
	const selectedBoxBlockInfo = getBlockAndBoxNum(selectedBoxRow, selectedBoxCol)
	return normalBoxBlockInfo.blockNum === selectedBoxBlockInfo.blockNum
}

const getEmptyInstanceInfo = () => {
	const info = {
		rows: new Array(),
		cols: new Array(),
		blocks: new Array(),
	}

	for (let i=0;i<9;i++) {
		info.rows.push({ cells: new Array(9).fill(0), count: 0 })
		info.cols.push({ cells: new Array(9).fill(0), count: 0 })
		info.blocks.push({ cells: new Array(9).fill(0), count: 0 })
	}

	return info
}

// this DS will be used to find out hidden singles, without having to use loops
const initNotesInstancesInfo = () => {
	for(let instance = 1;instance <= 9;instance++)
		notesInstancesPlacesInfo[instance] = getEmptyInstanceInfo()
}

// TODO: check if here solutionValue can be 0 instead of empty string
export const initBoardData = () => {	
	const sudokuBoard = new Array(9)
    for(let i=0;i<9;i++){
		const rowData = new Array(9)
		for(let j=0;j<9;j++){
			rowData[j] = {value: 0, solutionValue: '', isClue: 0}
		}
		sudokuBoard[i] = rowData
    }
    return sudokuBoard
}

export const getBlockAndBoxNum = (row, col) => {
	const blockNum = (row - row%3) + (col - col%3)/3
	const boxNum = (row%3)*3 + col%3
	return { blockNum, boxNum }
}

export const getRowAndCol = (blockNum, boxNum) => {
	const addToRow = (boxNum - boxNum%3)/3
	const row = (blockNum - blockNum%3) + addToRow
	const col = (blockNum%3)*3 + boxNum%3
	return { row, col }
}

// will be used for hidden singles DS only
// it is guranteed that this function would never return -1
const getFirstFilledPosition = (cells) => {
	for (let i=0;i<9;i++)
		if (cells[i]) return i
	return -1
}

// it will be used in "sudokuSolver" before using recursion technique
const findSingles = () => {
	// naked singles
	for (let row=0;row<9;row++)
		for (let col=0;col<9;col++)
			updateNakedSingles(row, col)

	// find hidden singles
	for (let num = 1;num <= 9; num++) {
		const { rows, cols, blocks } = notesInstancesPlacesInfo[num]
		for (let row=0;row<9;row++) {
			if (rows[row].count === 1) {
				const { cells } = rows[row]
				const cellNo = getFirstFilledPosition(cells)
				highlightedSinglesInfo.push({ row, col: cellNo, num })
			}
		}

		for (let col=0;col<9;col++) {
			if (cols[col].count === 1) {
				const { cells } = cols[col]
				const cellNo = getFirstFilledPosition(cells)
				highlightedSinglesInfo.push({ row: cellNo, col, num })
			}
		}

		for (let block=0;block<9;block++) {
			if (blocks[block].count === 1) {
				const { cells } = blocks[block]
				const cellNo = getFirstFilledPosition(cells)
				const { row, col } = getRowAndCol(block, cellNo)
				highlightedSinglesInfo.push({ row, col, num })
			}
		}
	}
}

// test if we are hiding values for already hidden cell or we are inserting values for already filled cells
// because of the error i saw in the algo today
const updateDuplicacyCheckerStore = (row, col, num) => {
	const numIndex = num - 1
	const { rows, cols, blocks } = duplicacyCheckerStore
	const { blockNum } = getBlockAndBoxNum(row, col)
	rows[row][numIndex] = 1 - rows[row][numIndex]
	cols[col][numIndex] = 1 - cols[col][numIndex]
	blocks[blockNum][numIndex] = 1 - blocks[blockNum][numIndex]
}

// it will update notes DS of all kinds
// and will return if the removed note (need it only for note which we are hiding) was naked/hidden sigle
const updateNoteInCell = (row, col, note, hideNote, validityChecksConfig) => {
	const countAdd = hideNote ? -1 : 1
	const showValue = hideNote ? 0 : 1

	// naked single DS
	notesData[row][col].boxNotes[note-1].show = showValue
	notesData[row][col].count += countAdd

	// hidden single DS
	const { rows, cols, blocks } = notesInstancesPlacesInfo[note]
	const { blockNum, boxNum } = getBlockAndBoxNum(row, col)
	rows[row].cells[col] = showValue // mark as present
	rows[row].count += countAdd // increase the count in current row
	cols[col].cells[row] = showValue
	cols[col].count += countAdd
	blocks[blockNum].cells[boxNum] = showValue
	blocks[blockNum].count += countAdd

	if (hideNote) {
		const {
			nakedSingle = false,
			rowHiddenSingle = false,
			colHiddenSingle = false,
			blockHiddenSingle = false,
		} = validityChecksConfig || {}
		return (
			(nakedSingle && !notesData[row][col].count)
			|| (rowHiddenSingle && !rows[row].count)
			|| (colHiddenSingle && !cols[col].count)
			|| (blockHiddenSingle && !blocks[blockNum].count)
		)
	}
}

const updateNakedSingles = (row, col) => {
	if (notesData[row][col].count === 1) {
		// got new naked single
		const { boxNotes } = notesData[row][col]
		for (let note=1;note<=9;note++) {
			if (boxNotes[note-1].show) {
				highlightedSinglesInfo.push({ row, col, num: note })
				return
			}
		}
	}
}

// from a cell when note is removed it might lead to new hidden singles
// of same type in same house
const updateHiddenSingles = (row, col, note, housesToCheck = {}) => {

	const { rows, cols, blocks } = notesInstancesPlacesInfo[note]
	const { checkInRow = true, checkInCol = true, checkInBlock = true } = housesToCheck

	if (checkInRow && rows[row].count === 1) {
		// hidden single generated in the row for "note"
		const { cells } = rows[row]
		const cellNo = getFirstFilledPosition(cells)
		highlightedSinglesInfo.push({ row, col: cellNo, num: note })
	}

	if (checkInCol && cols[col].count === 1) {
		// hidden single generated in the current col for "note"
		const { cells } = cols[col]
		const cellNo = getFirstFilledPosition(cells)
		highlightedSinglesInfo.push({ row: cellNo, col, num: note })
	}

	if (checkInBlock) {
		const { blockNum } = getBlockAndBoxNum(row, col)
		if (blocks[blockNum].count === 1) {
			// hidden single generated in the current block for the "note"
			const { cells } = blocks[blockNum]
			const cellNo = getFirstFilledPosition(cells)
			const { row, col } = getRowAndCol(blockNum, cellNo)
			highlightedSinglesInfo.push({ row, col, num: note })
		}
	}
}

const cellHasHiddenSingle = (row, col) => {
	const { blockNum } = getBlockAndBoxNum(row, col)
	for (let note=1;note<=9;note++) {
		if (notesData[row][col].boxNotes[note-1].show) {
			const { rows, cols, blocks } = notesInstancesPlacesInfo[note]
			if (rows[row].count === 1 || cols[col].count === 1 || blocks[blockNum].count === 1) return true
		}
	}
	return false
}

// going to insert num at the {row, col} cell, check for duplicacy
const duplicacyPresent = (row, col, num) => {
	const numIndex = num-1
	const { rows, cols, blocks } = duplicacyCheckerStore
	const { blockNum } = getBlockAndBoxNum(row, col)
	return (rows[row][numIndex] || cols[col][numIndex] || blocks[blockNum][numIndex])
}

const updateNotesAfterEmptyCell = (currentRow, currentCol, num, getNewCellsForNum) => {
	const { blockNum: currentBlockNum } = getBlockAndBoxNum(currentRow, currentCol)
	let newCells = []

	// update notes for current cell
	for (let note=1;note<=9;note++) {
		if (!duplicacyPresent(currentRow, currentCol, note)) {
			updateNoteInCell(currentRow, currentCol, note, false)
		}
	}
	// it's guranteed that only "num" got inserted in the cell if notes count is 1
	const numIsNakedSingleForCurrentCell = notesData[currentRow][currentCol].count === 1

	// update for every column of currentRow
	for (let col=0;col<9;col++) {
		if (col !== currentCol && !sudokuBoard[currentRow][col].value && !notesData[currentRow][col].boxNotes[num-1].show && !duplicacyPresent(currentRow, col, num)) {
			updateNoteInCell(currentRow, col, num, false)
			if (getNewCellsForNum && !cellHasHiddenSingle(currentRow, col)) newCells.push({ row: currentRow, col })
		}
	}
	const numIsHiddenSingleForCurrentRow = notesInstancesPlacesInfo[num].rows[currentRow].count === 1

	// update for every row of currentColumn
	for (let row=0;row<9;row++) {
		if (row !== currentRow && !sudokuBoard[row][currentCol].value && !notesData[row][currentCol].boxNotes[num-1].show && !duplicacyPresent(row, currentCol, num)) {
			updateNoteInCell(row, currentCol, num, false)
			if (getNewCellsForNum && !cellHasHiddenSingle(row, currentCol)) newCells.push({ row, col: currentCol })
		}
	}
	const numIsHiddenSingleForCurrentCol = notesInstancesPlacesInfo[num].cols[currentCol].count === 1

	// update for every box of the current block
	for (let boxNum=0;boxNum<9;boxNum++) {
		const { row, col } = getRowAndCol(currentBlockNum, boxNum)
		if (row === currentRow || col === currentCol) continue
		if (!sudokuBoard[row][col].value && !notesData[row][col].boxNotes[num-1].show && !duplicacyPresent(row, col, num)) {
			updateNoteInCell(row, col, num, false)
			if (getNewCellsForNum && !cellHasHiddenSingle(row, col)) newCells.push({ row, col })
		}
	}
	const numIsHiddenSingleForCurrentBlock = notesInstancesPlacesInfo[num].blocks[currentBlockNum].count === 1

	if (getNewCellsForNum && (numIsNakedSingleForCurrentCell || numIsHiddenSingleForCurrentRow || numIsHiddenSingleForCurrentCol || numIsHiddenSingleForCurrentBlock))
		newCells = []

	return newCells
}

// getting used in the below function to check if the cell we filled is correct or not at this step
const getValidityChecksConfig = (currentRow, currentCol, currentBlockNum, row, col, blockNum, currentCellDifferentNote = false) => {
	if (currentCellDifferentNote) {
		return {
			nakedSingle: false,
			rowHiddenSingle: true,
			colHiddenSingle: true,
			blockHiddenSingle: true,
		}
	}
	const validityChecksConfig = {
		nakedSingle: !(row === currentRow && col === currentCol),
		rowHiddenSingle: row !== currentRow,
		colHiddenSingle: col !== currentCol,
		blockHiddenSingle: blockNum !== currentBlockNum,
	}
	return validityChecksConfig
}

// it will tell if after filling the current cell sudoku will enter in invalidState
const updateNotesAfterFillCell = (currentRow, currentCol, num, updateSingles) => {
	const { blockNum: currentBlockNum } = getBlockAndBoxNum(currentRow, currentCol)
	let invalidFillInCurrentCell = false

	// remove all the notes from current cell except "num"
	// only "hidden singles" can be generated here, so watch over them also
	// And let's insert duplicate entries in "highlightedSinglesInfo" array and just don't do insert 
	// operation on already filled cell. this way i can check for correctness also.
	for (let note=1;note<=9;note++) {
		if (note === num) continue
		if (notesData[currentRow][currentCol].boxNotes[note-1].show) {
			// no chance of being removed note as naked single here
			// but these notes can be hidden single in currentRow, currentCol, currentBlock
			const validityChecksConfig = getValidityChecksConfig(currentRow, currentCol, currentBlockNum, currentRow, currentCol, currentBlockNum, true)
			invalidFillInCurrentCell = updateNoteInCell(currentRow, currentCol, note, true, validityChecksConfig) || invalidFillInCurrentCell
			updateSingles && updateHiddenSingles(currentRow, currentCol, note)
		}
	}

	// remove from current block
	for (let box=0;box<9;box++) {
		const { row, col } = getRowAndCol(currentBlockNum, box)
		if (notesData[row][col].boxNotes[num-1].show) {			
			const validityChecksConfig = getValidityChecksConfig(currentRow, currentCol, currentBlockNum, row, col, currentBlockNum)
			invalidFillInCurrentCell = updateNoteInCell(row, col, num, true, validityChecksConfig) || invalidFillInCurrentCell
			if (updateSingles) {
				updateNakedSingles(row, col)
				// update for hidden single. no need to check for any blocks
				// because it's the current block in which something is getting hidden
				// and in this block we have already filled "num"
				const housesToCheck = {
					checkInRow: row !== currentRow,
					checkInCol: col !== currentCol,
					checkInBlock: false,
				}
				updateHiddenSingles(row, col, num, housesToCheck)
			}
		}
	}

	// remove from currentRow, but only for the cells which are not in currentBlock
	for (let col=0;col<9;col++) {
		if (notesData[currentRow][col].boxNotes[num-1].show) {
			const validityChecksConfig = getValidityChecksConfig(currentRow, currentCol, currentBlockNum, currentRow, col, getBlockAndBoxNum(currentRow, col).blockNum)
			invalidFillInCurrentCell = updateNoteInCell(currentRow, col, num, true, validityChecksConfig) || invalidFillInCurrentCell
			if (updateSingles) {
				updateNakedSingles(currentRow, col)
				// no chance of hidden singles in row here
				// only column and blocks can have it
				const housesToCheck = {
					checkInRow: false,
					checkInCol: true,
					checkInBlock: true,
				}
				updateHiddenSingles(currentRow, col, num, housesToCheck)
			}
		}
	}

	// remove from current column
	for (let row=0;row<9;row++) {
		if (notesData[row][currentCol].boxNotes[num-1].show) {
			const validityChecksConfig = getValidityChecksConfig(currentRow, currentCol, currentBlockNum, row, currentCol, getBlockAndBoxNum(row, currentCol).blockNum)
			invalidFillInCurrentCell = updateNoteInCell(row, currentCol, num, true, validityChecksConfig) || invalidFillInCurrentCell
			if (updateSingles) {
				updateNakedSingles(row, currentCol)
				// no chance of hidden singles in column here
				// only row and blocks can have it
				const housesToCheck = {
					checkInRow: true,
					checkInCol: false,
					checkInBlock: true,
				}
				updateHiddenSingles(row, currentCol, num, housesToCheck)
			}
		}
	}

	return invalidFillInCurrentCell
}

const fillCell = (row, col, num, updateSingles) => {
	sudokuBoard[row][col].value = num
	updateDuplicacyCheckerStore(row, col, num)
	return updateNotesAfterFillCell(row, col, num, updateSingles)
}

const emptyCell = (row, col, getNewCellsForNum = false) => {
	const valueToBeRemoved = sudokuBoard[row][col].value
	sudokuBoard[row][col].value = 0
	updateDuplicacyCheckerStore(row, col, valueToBeRemoved)
	// 1. return new cells where "valueToBeRemoved" can be placed after removing it from current cell
	// 2. newCells won't have current cell in the list
	return updateNotesAfterEmptyCell(row, col, valueToBeRemoved, getNewCellsForNum)
}

const fillSingles = () => {
	const cellsFilled = []
	let invalidState = false
	for (let i=0;i<highlightedSinglesInfo.length;i++) {
		const { row, col, num } = highlightedSinglesInfo[i]
		if (!sudokuBoard[row][col].value) {
			cellsFilled.push({ row, col })
			if (fillCell(row, col, num, true)) {
				invalidState = true
				break
			}
		}
	}
	highlightedSinglesInfo = []
	return { cellsFilled, invalidState }
}

const fillRecursionIndependentBoxes = () => {
	const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	for(let row = 0;row < 3;row++){
		for(let col = 0;col < 3;col++){
			const pos = Math.floor(Math.random()*arr.length)
			sudokuBoard[row][col].value = arr[pos]
			arr.splice(pos, 1)
		}
	}
}

// TODO: store this info in a object and anytime a cell is getting emptied, update the object if 
// that cell is small than current one
// Remark: settling with this only
const getBoxToStartRecursionFrom = () => {
	let row = -1, col = -1
	for (let i=0;i<9;i++)
		for (let j=0;j<9;j++)
			if (!sudokuBoard[i][j].value)
				return { row: i, col: j }
	return { row, col }
}

const recursion = (row, col, alreadyFilledCells) => {
	let numberOfSolutions = 0
	const boxNotes = notesData[row][col].boxNotes
	for (let i=0;i<9;i++) {
		if (boxNotes[i].show) {
			//  don't search for singles because that "sudokuSolver" will do
			const invalidState = fillCell(row, col, i + 1, false)
			numberOfSolutions = !invalidState ? sudokuSolver(alreadyFilledCells + 1) : numberOfSolutions
			emptyCell(row, col)
			if (numberOfSolutions) {
				// break the loop here because in "generateClues" func we can't remove the clue
				// we are trying to remove. if we remove then it would lead to multiple solutions.
				break
			}
		}
	}
	return numberOfSolutions
}

// is it possible to know already that how many cells are already filled ??
// it would be an optimization and i wouldn't need to calculate that number
const sudokuSolver = (alreadyFilledCells) => {
	if (alreadyFilledCells === 81) return 1
	
	let numberOfSolutions = 0
	// while filling singles, the function will fill newly generated singles as well
	// and will check for duplicate entries as well, so no need to looping here
	findSingles()
	let { cellsFilled, invalidState } = fillSingles() // fillCell calls in this func will look for newly generated "naked" and "hidden" singles	
	if (!invalidState) { // keep on solving if the state is valid
		alreadyFilledCells += cellsFilled.length
		if (alreadyFilledCells === 81) numberOfSolutions = 1
		else {
			// human techniques didn't solve completely, now use computer recursion power
			const { row, col } = getBoxToStartRecursionFrom() // TODO: optimize this
			if (row !== -1 && col !== -1)
				numberOfSolutions = recursion(row, col, alreadyFilledCells)
		}
	}

	for (let i=0;i<cellsFilled.length;i++) {
		const { row, col } = cellsFilled[i]
		emptyCell(row, col)
	}
	cellsFilled = []

	return numberOfSolutions // possibly we are going to remove this cellsFilled from the return
}

const initializeDuplicacyCheckerStore = () => {
	const rows = []
	const cols = []
	const blocks = []
	for(let i=0;i<9;i++){
		rows.push(new Array(9).fill(0))
		cols.push(new Array(9).fill(0))
		blocks.push(new Array(9).fill(0))
	}

	for(let row=0; row < 9; row++){
		for(let col=0; col < 9; col++){
			let cellNum = sudokuBoard[row][col].value
			if (cellNum) {
				const numIndex = cellNum - 1
				rows[row][numIndex] = 1
				cols[col][numIndex] = 1
				const { blockNum } = getBlockAndBoxNum(row, col)
				blocks[blockNum][numIndex] = 1
			}
		}
	}
	
	duplicacyCheckerStore.rows = rows
	duplicacyCheckerStore.cols = cols
	duplicacyCheckerStore.blocks = blocks
}

const initNotesData = () => {
	notesData = new Array(9)
	for(let i = 0;i < 9;i++) {
        const rowNotes = []
        for(let j = 0;j < 9;j++) {
            const boxNotes = new Array(9)
            for(let k = 1;k <= 9;k++)
                boxNotes[k-1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
            rowNotes.push({ boxNotes, count: 0 })
        }
        notesData[i] = rowNotes
	}
}

const generateClues = (clues) => {	
	const clueTypeInstanceCount = new Array(10).fill(9)
	let numberOfDigitsDidExtinct = 0
	
	initNotesData() // DS for naked singles
	initNotesInstancesInfo() // DS for hidden singles
	// remove 9 clues, 1 from each row without any worries
	for (let row=0;row<9;row++) {
		const col = Math.floor(Math.random() * 9) // 9 cols are there
		const num = sudokuBoard[row][col].value
		sudokuBoard[row][col].value = 0
		updateDuplicacyCheckerStore(row, col, num)
		clueTypeInstanceCount[num]--
		if (clueTypeInstanceCount[num] === 0) numberOfDigitsDidExtinct++
		// update notes, these boxes will have only 1 note in them which is the "num" we just removed
		// so we don't need to check for any duplicacy of any kind
		updateNoteInCell(row, col, num, false)
	}
	// all good till this point. our duplicacy checker is working absolutely fine

	const filledCells = new Array()
	for (let row=0;row<9;row++)
		for (let col=0;col<9;col++)
			if (sudokuBoard[row][col].value) filledCells.push(row * 9 + col)

	let cluesToBeHidden = filledCells.length - clues
	let cellsFilled = filledCells.length // full board is filled at begining

	while (cluesToBeHidden) {
		if (!filledCells.length) break
		const filledBoxIndex = Math.floor(Math.random() * filledCells.length)
		const box = filledCells[filledBoxIndex]
		filledCells.splice(filledBoxIndex, 1)

		const row = Math.floor(box / 9)
		const col = box % 9
		
		const valueToHide = sudokuBoard[row][col].value
		// we can have only 1 number which can go fully extinct, else we are surely gonna 
		// have multiple solutions by just replacing all the instances of those two numbers
		if (clueTypeInstanceCount[valueToHide] === 1 && numberOfDigitsDidExtinct) continue

		// get the list of cells in which current cell's number might appear as a candidate
		// if we remove it and the list shouldn't contain the current cell
		const newCells = emptyCell(row, col, true)
		let safeToRemove = true
		for (let i=0;i<newCells.length && safeToRemove;i++) {
			const { row, col } = newCells[i]
			// don't look for naked and hidden singles here because that sudokuSolver is doing
			const invalidState = fillCell(row, col, valueToHide, false)
			const numOfSolutions = !invalidState ? sudokuSolver(cellsFilled) : 0
			// revert the above step and try another possible cell
			emptyCell(row, col)
			if (numOfSolutions) safeToRemove = false
		}

		if (safeToRemove) {
			cellsFilled--
			cluesToBeHidden--
			clueTypeInstanceCount[valueToHide]--
			if (clueTypeInstanceCount[valueToHide] === 0) numberOfDigitsDidExtinct++
		} else {
			// no need to look for naked and hidden singles
			fillCell(row, col, valueToHide, false)
		}
	}
}

// can't this use singleton technique ??
// TODO: make this recursion techique 
const backtrackForSolvedGridGen = (row, col) => {
    if (row == 9) return 1
    if (col == 9)  return backtrackForSolvedGridGen(row + 1, 0)
    if (sudokuBoard[row][col].value) return backtrackForSolvedGridGen(row, col + 1)

    for (let num = 1;num <= 9;num++) {
		if (!duplicacyPresent(row, col, num)) {
			sudokuBoard[row][col].value = num
			updateDuplicacyCheckerStore(row, col, num)
			if (!backtrackForSolvedGridGen(row, col + 1)) {
				sudokuBoard[row][col].value = 0
				updateDuplicacyCheckerStore(row, col, num)
			} else {
				sudokuBoard[row][col].value = 0
				updateDuplicacyCheckerStore(row, col, num)
				return 1
			}
		}
	}
	return 0
}

const recursionForSolvedGridGen = (row, col) => {
	return backtrackForSolvedGridGen(row, col)
}

const printBoardState = () => {
	const a = new Array(9)
	for (let row = 0;row < 9;row++) {
		a[row] = []
		for (let col = 0;col < 9;col++)
			a[row].push(sudokuBoard[row][col].value)
		console.log(...a[row])
	}
}

// below notesData is not required at all
export const generateNewSudokuPuzzle = async (clues, originalSudokuBoard) => {
	sudokuBoard = initBoardData()
	sudokuSolution = initBoardData() // TODO: we can remove this as well will remove it later

	// init duplicacy checker DS here
	fillRecursionIndependentBoxes()
	initializeDuplicacyCheckerStore()

	// TODO: do some research if below piece of code can be optimized or not
	for (let row = 0;row < 9;row++) {
		for (let col = 0;col < 9;col++) {
			const numChoices = []
			for (let num=1;num<=9;num++) numChoices.push(num)
			while (!sudokuBoard[row][col].value) {
				let numIndex = Math.floor(Math.random() * numChoices.length)
				let numToFill = numChoices[numIndex]
				numChoices.splice(numIndex, 1)
				if (duplicacyPresent(row, col, numToFill)) continue
				sudokuBoard[row][col].value = numToFill
				updateDuplicacyCheckerStore(row, col, numToFill)
				if (!recursionForSolvedGridGen(0, 0)) {
					sudokuBoard[row][col].value = 0
					updateDuplicacyCheckerStore(row, col, numToFill)
				}
			}
		}
	}

	// fully solved puzzle is ready and store the solution at this point
	for(let i=0;i<9;i++)
		for(let j=0;j<9;j++)
			sudokuSolution[i][j].value = sudokuBoard[i][j].value

	// remove numbers to generate the puzzle
	generateClues(clues)

	// console.log('@@@@@ required clues are', clues)

	// let count=0
	for(let i=0;i<9;i++){
		for(let j=0;j<9;j++){
			if (sudokuBoard[i][j].value) {
				originalSudokuBoard[i][j] = {value: sudokuBoard[i][j].value, isClue: 1, solutionValue: sudokuSolution[i][j].value}
				// count++
			}
			else originalSudokuBoard[i][j] = {value: 0, isClue: 0, solutionValue: sudokuSolution[i][j].value}
		}
	}

	// console.log('@@@@@ actual clues are', count)
	// printBoardState()
}

export const noOperationFunction = minisculePerfBoost => minisculePerfBoost && undefined

export const rgba = function(hex, opacity) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const result = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    return result
}

