let tempSudoku
let sudokuSolution
let highlightedSinglesInfo = []
const notesInstancesPlacesInfo = {}
const houseType = ['row', 'col', 'block']
const techniques = []

export const sameHouseAsSelected = (row, col, selectedBoxRow, selectedBoxCol) => {
	if(row === selectedBoxRow || col === selectedBoxCol) return true
	const normalBoxBlockInfo = getBlockAndBoxNum(row, col)
	const selectedBoxBlockInfo = getBlockAndBoxNum(selectedBoxRow, selectedBoxCol)
	return normalBoxBlockInfo.blockNum === selectedBoxBlockInfo.blockNum
}

const getEmptyInstanceInfo = () => {
	const info = {
		row: new Array(),
		col: new Array(),
		block: new Array(),
	}
	for (let i=0;i<9;i++) {
		info.row.push(new Array())
		info.col.push(new Array())
		info.block.push(new Array())
	}
	return info
}

const initNotesInstancesInfo = () => {
	for(let instance = 1;instance <= 9;instance++)
		notesInstancesPlacesInfo[instance] = getEmptyInstanceInfo()
}

// useful in filling cells using recursion
export const copyNotesInstancesInfo = () => {
	const notesInstancesPlacesInfoCopy = {}
	for(let instance=1;instance<=9;instance++){
		notesInstancesPlacesInfoCopy[instance] = getEmptyInstanceInfo()
		for(let i=0;i<houseType.length;i++){
			const house = houseType[i]
			for(let houseNo=0;houseNo<9;houseNo++){
				const instanceInfo = notesInstancesPlacesInfo[instance][house][houseNo]
				for(let j=0;j<instanceInfo.length;j++)
					notesInstancesPlacesInfoCopy[instance][house][houseNo].push(instanceInfo[j])
			}
		}
	}
	return notesInstancesPlacesInfoCopy
}

export const copyNotesInstancesInfoBack = (notesInstancesPlacesInfoCopy) => {
	for(let instance = 1;instance <= 9;instance++){
		for(let i=0;i<houseType.length;i++){
			const house = houseType[i]
			for(let houseNo=0;houseNo<9;houseNo++){
				notesInstancesPlacesInfo[instance][house][houseNo] = []
				const instanceInfo = notesInstancesPlacesInfoCopy[instance][house][houseNo]
				for(let j=0;j<instanceInfo.length;j++){
					notesInstancesPlacesInfo[instance][house][houseNo].push(instanceInfo[j])
				}
			}
		}
	}
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

const copyBoard = (sudokuBoard) => {
	for(let i=0;i<9;i++)
		for(let j=0;j<9;j++)
			tempSudoku[i][j].value = sudokuBoard[i][j].value
}

const getBlockRowCol = (row, col) => {
	let blockRow = row - row%3
	let blockCol = col - col%3
	return {blockRow, blockCol}
}

const getBlockAndBoxNum = (row, col) => {
	const blockNum = (row - row%3) + (col - col%3)/3
	const boxNum = (row%3)*3 + col%3
	return { blockNum, boxNum }
}

const getRowAndCol = (blockNum, boxNum) => {
	const addToRow = (boxNum - boxNum%3)/3
	const row = (blockNum - blockNum%3) + addToRow
	const col = (blockNum%3)*3 + boxNum%3
	return { row, col }
}

// this function will check if in row, col or block there is already an instance of 'num' is
// present or not in any box the common house shared by row,col box
export const duplicacyPresent = (row, col, num, sudokuBoard) => {
    for(let j=0;j<9;j++) if(sudokuBoard[row][j].value == num) return 1 // check row
	for(let i=0;i<9;i++) if(sudokuBoard[i][col].value == num) return 1 // check column

    // check in box
	const { blockRow, blockCol } =  getBlockRowCol(row, col)
    for(let i=0;i<3;i++)
		for(let j=0;j<3;j++)
			if(sudokuBoard[blockRow + i][blockCol + j].value == num) return 1
	return 0
}

// TODO: merge these two functions below
export const invalidSudokuState = (notesData, sudokuBoard) => {
	// check rows
	for(let row=0;row<9;row++){
		const occurence = new Array(10).fill(0)
		for(let col=0;col<9;col++) {
			const value = sudokuBoard[row][col].value
			if(!value) continue
			occurence[value]++
			if(occurence[value] === 2) return true
		}
	}

	// check columns
	for(let col=0;col<9;col++){
		const occurence = new Array(10).fill(0)
		for(let row=0;row<9;row++) {
			const value = sudokuBoard[row][col].value
			if(!value) continue
			occurence[value]++
			if(occurence[value] === 2) return true
		}
	}

	// check notes of each column to verify each empty cell have some choice left
	for(let row=0;row<9;row++){
		for(let col=0;col<9;col++) {
			if(sudokuBoard[row][col].value) continue
			let choicesLeft = false
			for(let instance=1;instance<=9;instance++) {
				if(notesData[row][col][instance-1].show){
					choicesLeft = true
					break
				}
			}
			if(!choicesLeft) return true
		}
	}

	return false
}

export const isSudokuSolved = (sudokuBoard) => {
	for(let row=0;row<9;row++)
		for(let col=0;col<9;col++)
			if(!sudokuBoard[row][col].value) return false

	// check rows
	for(let row=0;row<9;row++){
		const occurence = new Array(10).fill(0)
		for(let col=0;col<9;col++) {
			occurence[sudokuBoard[row][col].value]++
			if(occurence[sudokuBoard[row][col].value] === 2) return false
		}
	}

	// check columns
	for(let col=0;col<9;col++){
		const occurence = new Array(10).fill(0)
		for(let row=0;row<9;row++) {
			occurence[sudokuBoard[row][col].value]++
			if(occurence[sudokuBoard[row][col].value] === 2) return false
		}
	}

	return true
}

/*
	this will mark all the valid notes of the newly generated sudoku grid and then will
	also store the each occurences of a notes in every row/col/block
*/
export const generateNewPuzzleNotes = (notesData, sudokuBoard) => {
	initNotesInstancesInfo()
	for(let num=1;num<=9;num++) {
		for(let row=0;row<9;row++) {
			for(let col=0;col<9;col++) {
				if(!sudokuBoard[row][col].value && !duplicacyPresent(row, col, num, sudokuBoard)){
					const { blockNum, boxNum } = getBlockAndBoxNum(row, col)
					notesData[row][col][num-1].show = 1
					notesInstancesPlacesInfo[num].row[row].push(col) // row me konse col me present h
					notesInstancesPlacesInfo[num].col[col].push(row) // col me konse row me present h
					notesInstancesPlacesInfo[num].block[blockNum].push(boxNum) // block me konse box me present h
				}
			}
		}
	}
}

export const highlightNakedSingles = (notesData, sudokuBoard) => {
	for(let row=0;row<9;row++){
		for(let col=0;col<9;col++){
			let cnt = 0
			let instance
			for(let i=0;i<9;i++){
				if(notesData[row][col][i].show === 1) {
					cnt++
					instance = i+1
				}
			}
			if(cnt === 1) {
				notesData[row][col][instance-1].highlight = 1
				highlightedSinglesInfo.push({row: row, col: col, num: instance})
			}
		}
	}
	const filledCells = highlightedSinglesInfo.length !== 0
	fillSingles(notesData, sudokuBoard)
	return filledCells
}

// we are talking about hidden singles here
export const highlightHiddenSingles = (notesData, sudokuBoard) => {
	// TODO: right now there are duplicate entries getting stored here. later write a logic to remove that
	for(let instance = 1;instance <= 9;instance++) {
		for(let i=0;i<9;i++) {
			if(notesInstancesPlacesInfo[instance].row[i].length === 1) {
				const col = notesInstancesPlacesInfo[instance].row[i][0]
				notesData[i][col][instance-1].highlight = 1
				highlightedSinglesInfo.push({row: i, col: col, num: instance})
			}
			if(notesInstancesPlacesInfo[instance].col[i].length === 1) {
				const row = notesInstancesPlacesInfo[instance].col[i][0]
				notesData[row][i][instance-1].highlight = 1
				highlightedSinglesInfo.push({row: row, col: i, num: instance})
			}
			if(notesInstancesPlacesInfo[instance].block[i].length === 1) {
				const boxNum = notesInstancesPlacesInfo[instance].block[i][0]
				const { row, col } = getRowAndCol(i, boxNum)
				notesData[row][col][instance-1].highlight = 1
				highlightedSinglesInfo.push({row: row, col: col, num: instance})
			}
		}
	}
	const filledCells = highlightedSinglesInfo.length !== 0
	fillSingles(notesData, sudokuBoard)
	return filledCells
}

export const removeInstanceFromRowColumnAndBlock = (row, col, instanceInfo) => {
	const {blockNum, boxNum} = getBlockAndBoxNum(row, col)

	let index = instanceInfo.col[col].indexOf(row)
	if(index !== -1) instanceInfo.col[col].splice(index, 1)

	index = instanceInfo.row[row].indexOf(col)
	if(index !== -1) instanceInfo.row[row].splice(index, 1)

	index = instanceInfo.block[blockNum].indexOf(boxNum)
	if(index !== -1) instanceInfo.block[blockNum].splice(index, 1)
}

// fill all the spotted singles and also remove those notes from notesInstancesPlacesInfo
export const removeNotesInstanceInfo = (row, col, num) => {
	let instanceInfo = notesInstancesPlacesInfo[num]
	const instanceBoxes = [] // boxes from which this number should be removed
	for(let i=0;i<instanceInfo.row[row].length;i++){
		const col = instanceInfo.row[row][i]
		instanceBoxes.push({row, col})
	}
	for(let i=0;i<instanceInfo.col[col].length;i++){
		const row = instanceInfo.col[col][i]
		instanceBoxes.push({row, col})
	}
	let {blockNum, boxNum} = getBlockAndBoxNum(row, col)
	for(let i=0;i<instanceInfo.block[blockNum].length;i++){
		boxNum = instanceInfo.block[blockNum][i]
		const {row, col} = getRowAndCol(blockNum, boxNum)
		instanceBoxes.push({row, col})
	}

	// now all these boxes are part of a row, col, block and we have to remove the possibility of this num from all these places
	for(let i=0;i<instanceBoxes.length;i++){
		const {row, col} = instanceBoxes[i]
		removeInstanceFromRowColumnAndBlock(row, col, instanceInfo)
	}

	// empty all these arrays
	instanceInfo.row[row] = []
	instanceInfo.col[col] = []
	blockNum = getBlockAndBoxNum(row, col).blockNum
	instanceInfo.block[blockNum] = []

	// now remove possibilities of other instances from this box of the row, col, block
	for(let instance=1;instance<=9;instance++) {
		instanceInfo = notesInstancesPlacesInfo[instance]

		let index = instanceInfo.row[row].indexOf(col)
		if(index !== -1)
			instanceInfo.row[row].splice(index, 1)

		index = instanceInfo.col[col].indexOf(row)
		if(index !== -1)
			instanceInfo.col[col].splice(index, 1)

		const { blockNum, boxNum } = getBlockAndBoxNum(row, col)
		index = instanceInfo.block[blockNum].indexOf(boxNum)
		if(index !== -1)
			instanceInfo.block[blockNum].splice(index, 1)
	}
}

export const hideNote = (row, col, num, notesData) => {
	for(let j=0;j<9;j++) notesData[row][col][j].show = 0
	// hide all the notes of this number from this row, col, block
	for(let j=0;j<9;j++) {
		notesData[row][j][num-1].show = 0 // from row
		notesData[j][col][num-1].show = 0 // from col
	}
	const { blockCol, blockRow } = getBlockRowCol(row, col)
	for(let j=0;j<3;j++)
		for(let k=0;k<3;k++)
			notesData[blockRow + j][blockCol + k][num-1].show = 0 // from box
}

export const fillSingles = (notesData, sudokuBoard) => {
	for(let i=0;i<highlightedSinglesInfo.length;i++){
		const { row, col, num } = highlightedSinglesInfo[i]
		// hide all the notes of this box
		for(let j=0;j<9;j++) notesData[row][col][j].show = 0
		// hide all the notes of this number from this row, col, block
		for(let j=0;j<9;j++) {
			notesData[row][j][num-1].show = 0 // from row
			notesData[j][col][num-1].show = 0 // from col
		}
		const { blockCol, blockRow } = getBlockRowCol(row, col)
    	for(let j=0;j<3;j++)
			for(let k=0;k<3;k++)
				notesData[blockRow + j][blockCol + k][num-1].show = 0 // from box
		// unhighlight this highlighted clue
		notesData[row][col][num-1].highlight = 0
		// put this notes in the box as main value
		sudokuBoard[row][col].value = num
		// remove notes info from notesInstancesPlacesInfo
		removeNotesInstanceInfo(row, col, num)
	}
	highlightedSinglesInfo = []
}

const fillRecursionIndependentBoxes = (sudokuBoard) => {
	const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	for(let row = 0;row < 3;row++){
		for(let col = 0;col < 3;col++){
			const pos = Math.floor(Math.random()*arr.length)
			sudokuBoard[row][col].value = arr[pos]
			arr.splice(pos, 1)
		}
	}
}

const copyNotes = (notesData) => {
	const notesCopy = new Array(9)
	for(let i = 0;i < 9;i++) {
		const rowNotesCopy = []
		for(let j = 0;j < 9;j++) {
			const boxNotesCopy = new Array(9)
			for(let k = 1;k <= 9;k++){
				const show = notesData[i][j][k-1].show
				boxNotesCopy[k-1] = {"noteValue": k, show}
			}
			rowNotesCopy.push(boxNotesCopy)
		}
		notesCopy[i] = rowNotesCopy
	}
	return notesCopy
}

const copyNotesBack = (notesCopy, notesData) => {
	for(let row=0;row<9;row++){
		for(let col=0;col<9;col++){
			for(let instance=1;instance<=9;instance++){
				const show = notesCopy[row][col][instance-1].show
				notesData[row][col][instance-1].show = show
			}
		}
	}
}

const copyBoardData = (sudokuBoard) => {
	const boardDataCopy = new Array(9)
	for(let i=0;i<9;i++){
		const rowBoardData = new Array()
		for(let j=0;j<9;j++) {
			const value = sudokuBoard[i][j].value
			rowBoardData.push({value, solutionValue: '', isClue: 0})
		}
		boardDataCopy[i] = rowBoardData
	}
	return boardDataCopy
}

const copyBoardDataBack = (boardDataCopy, sudokuBoard) => {
	for(let row=0;row<9;row++){
		for(let col=0;col<9;col++){
			sudokuBoard[row][col].value = boardDataCopy[row][col].value
		}
	}
}

const getBoxToStartRecursionFrom = (sudokuBoard) => {
	let row = -1
	let col = -1
	for(let i=0;i<9;i++){
		for(let j=0;j<9;j++){
			if(!sudokuBoard[i][j].value){
				row = i
				col = j
				break
			}
		}
		if(row !== -1 && col !== -1) break
	}
	return { row, col }
}

// TODO: optimize data copy operations (top priority)
const recursion = (row, col, notesData, sudokuBoard) => {
	// make relevant information copies
	const notesCopy = copyNotes(notesData)
	const boardDataCopy = copyBoardData(sudokuBoard)
	const notesInstancesPlacesInfoCopy = copyNotesInstancesInfo()

	let numberOfSol = 0
	let valueToBeFilled = -1
	for(let i=0;i<notesCopy[row][col].length;i++){
		const noteVisible = notesCopy[row][col][i].show

		if(noteVisible){
			// hide note, fill box, remove instance info
			valueToBeFilled = i+1
			hideNote(row, col, valueToBeFilled, notesData)
			sudokuBoard[row][col].value = valueToBeFilled
			removeNotesInstanceInfo(row, col, valueToBeFilled)
			const childNumOfSol = sudokuSolver(notesData, sudokuBoard) // use techniques after guessing value for this cell
			numberOfSol += childNumOfSol
			// restore the state just like before
			copyBoardDataBack(boardDataCopy, sudokuBoard)
			copyNotesBack(notesCopy, notesData)
			copyNotesInstancesInfoBack(notesInstancesPlacesInfoCopy)
			if(numberOfSol > 1) break
		}
	}
	return numberOfSol
}

const sudokuSolver = (notesData, sudokuBoard) => {
	let iterateAgain = true
	let numberOfSolutions = 0
	let usedRecursion = false
	let sudokuSolved = isSudokuSolved(sudokuBoard)
	if(sudokuSolved)
		numberOfSolutions = 1

	while(!sudokuSolved && !numberOfSolutions){
		while(iterateAgain && !sudokuSolved){
			let progressMade = false
			for(let i=0;i<techniques.length && !sudokuSolved;i++){
				const technique = techniques[i]
				while(technique(notesData, sudokuBoard)){progressMade = true}
				sudokuSolved = isSudokuSolved(sudokuBoard)
			}
			iterateAgain = progressMade
		}
		if (!sudokuSolved) {
			// don't use recursion further if sudoku state is invalid
			if(invalidSudokuState(notesData, sudokuBoard)) return 0
			const { row, col } = getBoxToStartRecursionFrom(sudokuBoard)
			if(row !== -1 && col !== -1)
				numberOfSolutions = recursion(row, col, notesData, sudokuBoard)
			usedRecursion = true
		}
		else numberOfSolutions = 1
		if(usedRecursion && numberOfSolutions === 0) break
	}
	return numberOfSolutions
}

const insertTechniques = () => {
	techniques.push(highlightNakedSingles)
	techniques.push(highlightHiddenSingles)
}

const generateClues = (clues, notesData, sudokuBoard) => {
	insertTechniques()
	const filledCells = new Array()
	for(let i=0;i<81;i++) filledCells.push(i)
	let cluesToBeHidden = 81 - clues

	const clueTypeInstanceCount = new Array(10).fill(9)
	let numberOfDigitsDidExtinct = 0
	while(cluesToBeHidden){
		if(!filledCells.length) break
		const filledBoxIndex = Math.floor(Math.random() * filledCells.length)
		const box = filledCells[filledBoxIndex]
		filledCells.splice(filledBoxIndex, 1)

		const row = Math.floor(box / 9)
		const col = box % 9

		const valueToHide = sudokuBoard[row][col].value
		if (clueTypeInstanceCount[valueToHide] === 1 && numberOfDigitsDidExtinct) continue
		sudokuBoard[row][col].value = 0
		const boardDataCopy = copyBoardData(sudokuBoard)
		// TODO:optimize this step to only 1 cell
		generateNewPuzzleNotes(notesData, sudokuBoard) // generate notes before solving
		const numOfSolutions = sudokuSolver(notesData, sudokuBoard)
		if (numOfSolutions == 1) {
			cluesToBeHidden--
			clueTypeInstanceCount[valueToHide]--
			if(clueTypeInstanceCount[valueToHide] === 0) numberOfDigitsDidExtinct++
		}
		else {
			boardDataCopy[row][col].value = valueToHide
		}
		copyBoardDataBack(boardDataCopy, sudokuBoard)
	}
}

const hideAllNotes = (notesData) => {
	for(let row=0;row<9;row++){
		for(let col=0;col<9;col++){
			for(let i=0;i<9;i++){
				notesData[row][col][i].show = 0
			}
		}
	}
}

const backtrackForSolvedGridGen = (row, col) => {
    if(row == 9) return 1
    if(col == 9)  return backtrackForSolvedGridGen(row + 1, 0)
    if(tempSudoku[row][col].value) return backtrackForSolvedGridGen(row, col + 1)

    for(let num = 1;num <= 9;num++){
		if(!duplicacyPresent(row, col, num, tempSudoku)){
			tempSudoku[row][col].value = num
			if(!backtrackForSolvedGridGen(row, 1 + col)) tempSudoku[row][col].value = 0
			else return 1
		}
	}
	if(tempSudoku[row][col] == 0) return 0
}

const recursionForSolvedGridGen = (row, col, sudokuBoard) => {
    copyBoard(sudokuBoard)
    return backtrackForSolvedGridGen(row, col)
}

export const generateNewSudokuPuzzle = async (clues, notesData, originalSudokuBoard) => {
	const sudokuBoard = initBoardData()
	tempSudoku = initBoardData()
	sudokuSolution = initBoardData()

	fillRecursionIndependentBoxes(sudokuBoard)

	for(let row = 0;row < 9;row++){
		for(let col = 0;col < 9;col++){
            const markInvalidNumbers = new Array(10).fill(0)
			while(!sudokuBoard[row][col].value){
				let numToFill = Math.floor(Math.random()*9) + 1
				while(markInvalidNumbers[numToFill] || duplicacyPresent(row, col, numToFill, sudokuBoard))
					numToFill = Math.floor(Math.random()*9) + 1
				sudokuBoard[row][col].value = numToFill
				if(!recursionForSolvedGridGen(0, 0, sudokuBoard)){
					sudokuBoard[row][col].value = 0
					markInvalidNumbers[numToFill] = 1
				}
			}
		}
	}

	for(let i=0;i<9;i++)
		for(let j=0;j<9;j++)
			sudokuSolution[i][j].value = sudokuBoard[i][j].value

	generateClues(clues, notesData, sudokuBoard)
	hideAllNotes(notesData)

	for(let i=0;i<9;i++){
		for(let j=0;j<9;j++){
			if (sudokuBoard[i][j].value)
				originalSudokuBoard[i][j] = {value: sudokuBoard[i][j].value, isClue: 1, solutionValue: sudokuSolution[i][j].value}
			else originalSudokuBoard[i][j] = {value: 0, isClue: 0, solutionValue: sudokuSolution[i][j].value}
		}
	}

}