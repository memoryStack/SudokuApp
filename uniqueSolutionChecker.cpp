#include </Users/anujrao/Desktop/stdc++.h>
#include <string>
#include <chrono>
using namespace std;

#define TIMING
 
#ifdef TIMING
#define INIT_TIMER auto start = std::chrono::high_resolution_clock::now();
#define START_TIMER  start = std::chrono::high_resolution_clock::now();
#define STOP_TIMER(name)  std::cout << "RUNTIME of " << name << ": " << \
    std::chrono::duration_cast<std::chrono::milliseconds>( \
            std::chrono::high_resolution_clock::now()-start \
    ).count() << " ms " << std::endl; 
#else
#define INIT_TIMER
#define START_TIMER
#define STOP_TIMER(name)
#endif



enum HOUSE_TYPE {
    ROW,
    COL,
    BLOCK,
};

const int CELLS_IN_HOUSE = 9;
const int HOUSES_COUNT = 9;
const int NUMBERS_IN_HOUSE = 9;

struct Cell {
    int row;
    int col;
};

struct BlockCell {
    int blockNum;
    int boxNum;
};

struct House {
    HOUSE_TYPE type;
    int num;
};

struct CellMainNumber {
    int value;
    int solutionValue;
    bool isClue;
};

struct CellNotes {
    int visible[9] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    int count = 0;
};

struct NoteInHouse {
    int cells[9] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
    int count = 0;
};

struct NoteInHouses {
    NoteInHouse rows[9];
    NoteInHouse cols[9];
    NoteInHouse blocks[9];
};

struct Single {
    Cell cell;
    int num;
};

struct FilledSinglesStats {
    vector <Cell> cellsFilled;
    bool invalidState;
};

struct DuplicacyCheckerStore {
    int rows[9][9];
    int cols[9][9];
    int blocks[9][9];
};

struct NoteRemoveValidityChecksConfigs {
    bool nakedSingle = false;
    bool rowHiddenSingle = false;
    bool colHiddenSingle = false;
    bool blockHiddenSingle = false;
};

// defaults are required to be all true
struct HiddenSingleHousesCheckConfigs {
    bool checkInRow = true;
    bool checkInCol = true;
    bool checkInBlock = true;
};

vector<vector<CellMainNumber> > mainNumbers;
CellNotes boardNotes[9][9]; // will be used for naked singles and notes in cell in general
NoteInHouses notesInHouses[9]; // will be used for hidden singles in houses
vector <Single> highlightedSinglesInfo;
DuplicacyCheckerStore duplicacyCheckerStore;

int getSolutionsCountForPuzzleType();

Cell blockCellToBoardCell(BlockCell blockCell) {
	int boxNum = blockCell.boxNum;
    int blockNum = blockCell.blockNum;
    int addToRow = (boxNum - (boxNum % 3)) / 3;
    int row = blockNum - (blockNum % 3) + addToRow;
    int col = (blockNum % 3) * 3 + (boxNum % 3);
    return {row, col};
}

vector<Cell> getRowHouseCells(int houseNum) {
    vector<Cell> result;
    for (int col = 0; col < CELLS_IN_HOUSE; col++) {
        Cell cell = {houseNum,col};
        result.push_back(cell);
    }
    return result;
}

vector<Cell> getColHouseCells(int houseNum) {
    vector<Cell> result;
    for (int row = 0; row < CELLS_IN_HOUSE; row++) {
        Cell cell = {row, houseNum};
        result.push_back(cell);
    }
    return result;
}

vector<Cell> getBlockHouseCells(int houseNum) {
    vector<Cell> result;
    for (int box = 0; box < CELLS_IN_HOUSE; box++) {
        BlockCell blockCell = {houseNum, box};
        result.push_back(blockCellToBoardCell(blockCell));
    }
    return result;
}

vector<Cell> getHouseCells(House house) {
    if (house.type == ROW) return getRowHouseCells(house.num);
    if (house.type == COL) return getColHouseCells(house.num);
    if (house.type == BLOCK) return getBlockHouseCells(house.num);
}

House getCellRowHouseInfo(Cell cell) {
    House house = { ROW, cell.row };
    return house;
} 

House getCellColHouseInfo(Cell cell) {
    House house = { COL, cell.col };
    return house;
}

BlockCell boardCellToBlockCell(Cell cell) {
    int row = cell.row;
    int col = cell.col;
    int blockNum = row - (row % 3) + (col - (col % 3)) / 3;
    int boxNum = (row % 3) * 3 + (col % 3);
    return { blockNum, boxNum };
}

BlockCell getBlockAndBoxNum(Cell cell) {
    return boardCellToBlockCell(cell);
} 

House getCellBlockHouseInfo(Cell cell) {
    House house = { BLOCK, getBlockAndBoxNum(cell).blockNum };
    return house;
}

House getCellHouseForHouseType(HOUSE_TYPE houseType, Cell cell) {
    if (houseType == ROW) return getCellRowHouseInfo(cell);
    if (houseType == COL) return getCellColHouseInfo(cell);
    if (houseType == BLOCK) return getCellBlockHouseInfo(cell);
}

Cell cellNumToBoardCell(int cellNum) {
    Cell cell = {
        cellNum / HOUSES_COUNT,
        cellNum % HOUSES_COUNT
    };

    return cell;
}

Cell convertBoardCellNumToCell(int cellNum) {
    return cellNumToBoardCell(cellNum);
}

CellMainNumber getCellMainNumberDefaultValue() {
    return { 0, 0, false };
}

vector<vector<CellMainNumber> > initMainNumbers() {
    vector<vector<CellMainNumber> > result;
    for (int i = 0; i < HOUSES_COUNT; i++) {
        vector <CellMainNumber> rowData;
        for (int j = 0; j < CELLS_IN_HOUSE; j++) {
            rowData.push_back(getCellMainNumberDefaultValue());
        }
        result.push_back(rowData);
    }
    return result;
}

void generateMainNumbersFromPuzzleString(string puzzle) {
    mainNumbers = initMainNumbers();

    for (int i = 0; i < puzzle.length(); i++) {
        Cell cell = convertBoardCellNumToCell(i);
        int row = cell.row;
        int col = cell.col;
        
        string s(1, puzzle[i]);
        int cellValue = stoi(s);
        mainNumbers[row][col].value = cellValue;
        if (cellValue != 0) mainNumbers[row][col].isClue = true;
    }
}

int getCellMainValue(Cell cell) {
    return mainNumbers[cell.row][cell.col].value;
}

bool isCellFilledWithNumber(
    int number,
    Cell cell
) {
    return number == getCellMainValue( cell);
}

bool isCellFilled(
    Cell cell
) { 
    return getCellMainValue( cell) != 0;
}

bool isNoteVisibleInCell(int note, Cell cell) {
    return boardNotes[cell.row][cell.col].visible[note];
}

bool mainNumberCountExccedsThresholdInAnyHouseOfCell(
    int number,
    Cell cell,
    int threshold
) {
    HOUSE_TYPE allHouses[] = {ROW, COL, BLOCK};

    for (int i=0;i<3;i++) {
        HOUSE_TYPE houseType = allHouses[i];
        
        vector<Cell> houseCells = getHouseCells(getCellHouseForHouseType(houseType, cell));

        int numberHostCellsInHouse = 0;
        for (int j=0;j<houseCells.size();j++) {
            Cell houseCell = houseCells[j];
            if (isCellFilledWithNumber( number, houseCell)) {
                numberHostCellsInHouse++;
            }
        }
        if (numberHostCellsInHouse > threshold) return true;
    }
    return false;
}

bool isMainNumberPresentInAnyHouseOfCell(
    int number,
    Cell cell
) {
    return mainNumberCountExccedsThresholdInAnyHouseOfCell(number, cell, 0);
} 

bool isNakedSingleInCell(Cell cell) {
    return boardNotes[cell.row][cell.col].count == 1;
}

bool isNoteHiddenSingleInHouse(int note, House house) {
    int houseNum = house.num;
    if (house.type == ROW) return notesInHouses[note].rows[houseNum].count == 1;
    if (house.type == COL) return notesInHouses[note].cols[houseNum].count == 1;
    if (house.type == BLOCK) return notesInHouses[note].blocks[houseNum].count == 1;
}

bool isValidHiddenSingle(Single s) { return s.num != -1; }

int getFirstSetEntryIndex(int cells[]) {
    for (int i=0;i<9;i++) if (cells[i]) return i;
    return -1;
}

int getNakedSingleNoteInCell(Cell cell) {
    return getFirstSetEntryIndex(boardNotes[cell.row][cell.col].visible);
}

void addFoundSingle(Cell cell, int num) {
    Single singleInfo = (Single){.cell = cell, .num = num};
    highlightedSinglesInfo.push_back(singleInfo);
}

Single invalidHiddenSingle = { {-1, -1},-1 };
Single getHiddenSingleInHouseOfNote(int note, House house) {
    if (!isNoteHiddenSingleInHouse(note, house)) return invalidHiddenSingle;
    
    int houseNum = house.num;

    if (house.type == ROW) {
        int cellNo = getFirstSetEntryIndex(notesInHouses[note].rows[houseNum].cells);
        return (Single) {.cell = {houseNum, cellNo}, .num = note};
    }
    
    if (house.type == COL) {
        int cellNo = getFirstSetEntryIndex(notesInHouses[note].cols[houseNum].cells);
        return (Single) {.cell = {cellNo, houseNum}, .num = note};
    }

    int cellNo = getFirstSetEntryIndex(notesInHouses[note].blocks[houseNum].cells);
    BlockCell blockCell = {houseNum, cellNo};
    Cell cell = blockCellToBoardCell(blockCell);
    return (Single) {.cell = cell, .num = note};
}

void updateNakedSingles(Cell cell) {
    if (isNakedSingleInCell(cell)) {
        addFoundSingle(cell, getNakedSingleNoteInCell(cell));
    }
}

// we can have duplicate entries as well
void findSingles() {
    for (int row=0;row<9;row++) {
        for (int col=0;col<9;col++) {
            Cell cell = {row, col};
            if (!isCellFilled(cell)) updateNakedSingles(cell);
        }
    }

    for (int note = 0;note < 9; note++) {
        HOUSE_TYPE allHouses[] = {ROW, COL, BLOCK};
        for (int j=0;j<3;j++) {
            for (int houseNo=0;houseNo<9;houseNo++) {
                House h = {allHouses[j], houseNo};
                Single hiddenSingle = getHiddenSingleInHouseOfNote(note, h);
                if (isValidHiddenSingle(hiddenSingle)) {
                    addFoundSingle(hiddenSingle.cell, note);
                }
            }
        }
    }
}

void updateDuplicacyCheckerStore(Cell cell, int num) {
    duplicacyCheckerStore.rows[cell.row][num] = 1 - duplicacyCheckerStore.rows[cell.row][num];
    duplicacyCheckerStore.cols[cell.col][num] = 1 - duplicacyCheckerStore.cols[cell.col][num];
    int blockNum = getBlockAndBoxNum(cell).blockNum;
    duplicacyCheckerStore.blocks[blockNum][num] = 1 - duplicacyCheckerStore.blocks[blockNum][num];
}

// getting used in the below function to check if the cell
// we filled is correct or not at this step
NoteRemoveValidityChecksConfigs getValidityChecksConfig(
    Cell filledCell,
    Cell anotherCell,
    bool currentCellDifferentNote
) {
    NoteRemoveValidityChecksConfigs validityChecksConfig;
    if (currentCellDifferentNote) {
        validityChecksConfig.nakedSingle = false;
        validityChecksConfig.rowHiddenSingle = true;
        validityChecksConfig.colHiddenSingle = true;
        validityChecksConfig.blockHiddenSingle = true;
    } else {
        validityChecksConfig.nakedSingle = !(anotherCell.row == filledCell.row && anotherCell.col == filledCell.col);
        validityChecksConfig.rowHiddenSingle = anotherCell.row != filledCell.row;
        validityChecksConfig.colHiddenSingle = anotherCell.col != filledCell.col;
        validityChecksConfig.blockHiddenSingle =  getBlockAndBoxNum(anotherCell).blockNum != getBlockAndBoxNum(filledCell).blockNum;
    }
    return validityChecksConfig;
}

bool updateNoteInCell(Cell cell, int note, bool hideNote, NoteRemoveValidityChecksConfigs validityChecksConfig) {
    int countAdd = hideNote ? -1 : 1;
    int showValue = hideNote ? 0 : 1;

    int noteIndex = note;

    // naked single or notes in general DS
    boardNotes[cell.row][cell.col].visible[noteIndex] = showValue;
    boardNotes[cell.row][cell.col].count += countAdd;

    // hidden single DS
    BlockCell cellCoordinatesInBlockHouse = getBlockAndBoxNum(cell);
    int blockNum = cellCoordinatesInBlockHouse.blockNum;
    int blockCellNum = cellCoordinatesInBlockHouse.boxNum;
    notesInHouses[noteIndex].rows[cell.row].cells[cell.col] = showValue;
    notesInHouses[noteIndex].rows[cell.row].count += countAdd;
    notesInHouses[noteIndex].cols[cell.col].cells[cell.row] = showValue;
    notesInHouses[noteIndex].cols[cell.col].count += countAdd;
    notesInHouses[noteIndex].blocks[blockNum].cells[blockCellNum] = showValue;
    notesInHouses[noteIndex].blocks[blockNum].count += countAdd;
    bool isInvalidNoteRemoval = hideNote && (
        (validityChecksConfig.nakedSingle && !boardNotes[cell.row][cell.col].count)
        || (validityChecksConfig.rowHiddenSingle && !notesInHouses[noteIndex].rows[cell.row].count)
        || (validityChecksConfig.colHiddenSingle && !notesInHouses[noteIndex].cols[cell.col].count)
        || (validityChecksConfig.blockHiddenSingle && !notesInHouses[noteIndex].blocks[blockNum].count)
    );

    return isInvalidNoteRemoval;
}

void printSingle(Single s) {
    cout<<"print newly found isngles: "<<s.cell.row<<"  "<<s.cell.col<<"  "<<s.num<<endl;
}

void updateHiddenSingles(Cell cell, int note, HiddenSingleHousesCheckConfigs configs) {
    int row = cell.row;
    int col = cell.col;
    if (configs.checkInRow && notesInHouses[note].rows[row].count == 1) {
        // hidden single generated in the row for "note"
        House h = {ROW, row};
        Single single = getHiddenSingleInHouseOfNote(note, h);
        // cout<<"before comparison  "<<(notesInHouses[note].cols[col].count == 1)<<endl;
        // printSingle(single);
        addFoundSingle(single.cell, single.num);
    }
    if (configs.checkInCol && notesInHouses[note].cols[col].count == 1) {
        // hidden single generated in the current col for "note"
        House h = {COL, col};
        Single single = getHiddenSingleInHouseOfNote(note, h);
        // cout<<"before comparison  "<<(notesInHouses[note].cols[col].count == 1)<<endl;
        // printSingle(single);
        addFoundSingle(single.cell, single.num);
    }
    if (configs.checkInBlock) {
        int blockNum = getBlockAndBoxNum(cell).blockNum;
        if (notesInHouses[note].blocks[blockNum].count == 1) {
            House h = {BLOCK, blockNum};
            Single single = getHiddenSingleInHouseOfNote(note, h);
            // printSingle(single);
            addFoundSingle(single.cell, single.num);
        }
    }
}

HiddenSingleHousesCheckConfigs getHiddenSingleHousesCheckConfigs(
    Cell filledCell,
    Cell anotherCell
) {
    HiddenSingleHousesCheckConfigs config;
    config.checkInRow = anotherCell.row != filledCell.row;
    config.checkInCol = anotherCell.col != filledCell.col;
    config.checkInBlock = getBlockAndBoxNum(anotherCell).blockNum != getBlockAndBoxNum(filledCell).blockNum;
    return config;
}

void printCellNotes(Cell cell) {
    cout<<"cell notes:  ";
    for (int i=0;i<9;i++) {
        cout<<boardNotes[cell.row][cell.col].visible[i];
    }cout<<endl;
}

bool updateNotesAfterFillCell(Cell filledCell, int num, bool updateSingles) {
    int currentRow = filledCell.row;
    int currentCol = filledCell.col;
    BlockCell cellCoordinatesInBlockHouse = getBlockAndBoxNum(filledCell);
    int filledCellBlockNum = cellCoordinatesInBlockHouse.blockNum;
    bool invalidFillInCurrentCell = false;

    // remove all the notes from current cell except "num". whyyyyyy ??
    // only "hidden singles" can be generated here, so watch over them also
    // And let's insert duplicate entries in "highlightedSinglesInfo" array and just don't do insert 
    // operation on already filled cell. this way i can check for correctness also.
    for (int note=0;note<9;note++) {
        if (note == num) continue;
        if (isNoteVisibleInCell(note, filledCell)) {
            // no chance of being removed note as naked single here
            // but these notes can be hidden single in currentRow, currentCol, currentBlock
            NoteRemoveValidityChecksConfigs validityChecksConfig = getValidityChecksConfig(filledCell, filledCell, true);
            invalidFillInCurrentCell = updateNoteInCell(filledCell, note, true, validityChecksConfig) || invalidFillInCurrentCell;

            // cout<<"1: "<<invalidFillInCurrentCell<<endl;

            if (updateSingles) {
                HiddenSingleHousesCheckConfigs housesToCheckConfig;
                updateHiddenSingles(filledCell, note, housesToCheckConfig);
            }
        }
    }

    // remove from current block
    for (int cellNum=0;cellNum<9;cellNum++) {
        BlockCell blockCell = {filledCellBlockNum, cellNum};
        Cell cell = blockCellToBoardCell(blockCell);
        int row = cell.row;
        int col = cell.col;
        if (isNoteVisibleInCell(num, cell) ) {
            NoteRemoveValidityChecksConfigs validityChecksConfig = getValidityChecksConfig(filledCell, cell, false);
            invalidFillInCurrentCell = updateNoteInCell(cell, num, true, validityChecksConfig) || invalidFillInCurrentCell;
            // cout<<"2: "<<invalidFillInCurrentCell<<endl;
            if (updateSingles) {
                updateNakedSingles(cell);
                // update for hidden single. no need to check for any blocks
                // because it's the current block in which something is getting hidden
                // and in this block we have already filled "num"
                HiddenSingleHousesCheckConfigs housesToCheckConfig = getHiddenSingleHousesCheckConfigs(filledCell, cell);
                updateHiddenSingles(cell, num, housesToCheckConfig);
            }
        }
    }

    // remove from currentRow, but only for the cells which are not in currentBlock
    for (int col=0;col<9;col++) {
        Cell cell = {filledCell.row, col};
        // cout<<"checking cell: "<<cell.row<<"  "<<cell.col <<" and num "<<num<<endl;
        // printCellNotes(cell);
        // cout<<"note visible or not: "<<isNoteVisibleInCell(num, cell)<<endl;
        if (isNoteVisibleInCell(num, cell)) {
            NoteRemoveValidityChecksConfigs validityChecksConfig = getValidityChecksConfig(filledCell, cell, false);
            invalidFillInCurrentCell = updateNoteInCell(cell, num, true, validityChecksConfig) || invalidFillInCurrentCell;
            // cout<<"cell with issue: "<<cell.row<<"  "<<cell.col <<" and num "<<num<<endl;
            // cout<<"3: "<<invalidFillInCurrentCell<<endl;
            
            if (updateSingles) {
                updateNakedSingles(cell);
                // no chance of hidden singles in row here
                // only column and blocks can have it
                HiddenSingleHousesCheckConfigs housesToCheckConfig = getHiddenSingleHousesCheckConfigs(filledCell, cell);
                updateHiddenSingles(cell, num, housesToCheckConfig);
            }
        }
    }

    // remove from current column
    for (int row=0;row<9;row++) {
        Cell cell = {row, filledCell.col};
        if (isNoteVisibleInCell(num, cell)) {
            NoteRemoveValidityChecksConfigs validityChecksConfig = getValidityChecksConfig(filledCell, cell, false);
            invalidFillInCurrentCell = updateNoteInCell(cell, num, true, validityChecksConfig) || invalidFillInCurrentCell;
            // cout<<"4: "<<invalidFillInCurrentCell<<endl;
            if (updateSingles) {
                updateNakedSingles(cell);
                HiddenSingleHousesCheckConfigs housesToCheckConfig =
                    getHiddenSingleHousesCheckConfigs(filledCell, cell);
                updateHiddenSingles(cell, num, housesToCheckConfig);
            }
        }
    }

    return invalidFillInCurrentCell;
}

bool fillCell(Single single, bool updateSingles) {
    Cell cell = single.cell;
    mainNumbers[cell.row][cell.col].value = single.num + 1;
    updateDuplicacyCheckerStore(cell, single.num);
    return updateNotesAfterFillCell(cell, single.num, updateSingles);
}

FilledSinglesStats fillSingles() {
    vector <Cell> cellsFilled;
    bool invalidState = false;
    for (int i=0;i<highlightedSinglesInfo.size();i++) {
        Single singleToBeFilled = highlightedSinglesInfo[i];
        Cell cell = singleToBeFilled.cell;
        if (!isCellFilled(cell)) {
            cellsFilled.push_back(cell);
            if (fillCell(singleToBeFilled, true)) {
                invalidState = true;
                break;
            }
        }
    }
    highlightedSinglesInfo.clear();
    FilledSinglesStats stats = {cellsFilled, invalidState};
    return stats;
}

bool duplicacyPresent(Cell cell, int num) {
    BlockCell cellCoordinatesInBlockHouse = getBlockAndBoxNum(cell);
    return
        duplicacyCheckerStore.rows[cell.row][num]
        || duplicacyCheckerStore.cols[cell.col][num]
        || duplicacyCheckerStore.blocks[cellCoordinatesInBlockHouse.blockNum][num];
}

bool cellHasHiddenSingle(Cell cell) {
    int blockNum = getBlockAndBoxNum(cell).blockNum;
    for (int note=0;note<9;note++) {
        if (isNoteVisibleInCell(note, cell)) {
            if (
                notesInHouses[note].rows[cell.row].count == 1 
                || notesInHouses[note].cols[cell.col].count == 1 
                || notesInHouses[note].blocks[blockNum].count == 1
            )
                return true;
        }
    }
    return false;
}

vector <Cell> updateNotesAfterEmptyCell(Cell emptiedCell, int num, bool getNewCellsListForNum) {
    int filledCellBlockNum = getBlockAndBoxNum(emptiedCell).blockNum;
    
    // new cells where "num" will appear as a note if after we removed it from
    // the current cell
    vector <Cell> newCells;

    // will be initialized for default configs, never check for 
    // any invalidity of any kind while cell is emptied
    NoteRemoveValidityChecksConfigs validityChecksConfig;

    // update notes for current cell
    for (int note=0;note<9;note++) {
        if (!duplicacyPresent(emptiedCell, note)) {
            updateNoteInCell(emptiedCell, note, false, validityChecksConfig);
        }
    }
    // it's guranteed that only "num" got inserted in the cell if notes count is 1
    bool numIsNakedSingleForCurrentCell = isNakedSingleInCell(emptiedCell);
    
    // update for every column of currentRow
    for (int col=0;col<9;col++) {
        Cell newCell = {emptiedCell.row, col};
        if (
            col != emptiedCell.col
            && !isCellFilled(newCell)
            && !isNoteVisibleInCell(num, newCell)
            && !duplicacyPresent(newCell, num)
        ) {
            updateNoteInCell(newCell, num, false, validityChecksConfig);
            if (getNewCellsListForNum && !cellHasHiddenSingle(newCell)) {
                newCells.push_back(newCell);
            }
        }
    }
    bool numIsHiddenSingleForCurrentRow = notesInHouses[num].rows[emptiedCell.row].count == 1;

    // update for every row of currentColumn
    for (int row=0;row<9;row++) {
        Cell newCell = {row, emptiedCell.col};
        if (
            row != emptiedCell.row
            && !isCellFilled(newCell)
            && !isNoteVisibleInCell(num, newCell)
            && !duplicacyPresent(newCell, num)
        ) {
            updateNoteInCell(newCell, num, false, validityChecksConfig);
            if (getNewCellsListForNum && !cellHasHiddenSingle(newCell)) {
                newCells.push_back(newCell);
            }
        }
    }
    bool numIsHiddenSingleForCurrentCol = notesInHouses[num].cols[emptiedCell.col].count == 1;

    // update for every box of the current block
    for (int cellNum=0;cellNum<9;cellNum++) {
        BlockCell blockCell = {filledCellBlockNum, cellNum};
        Cell cell = blockCellToBoardCell(blockCell);
        int row = cell.row;
        int col = cell.col;
        if (row == emptiedCell.row || col == emptiedCell.col) continue;
        if (
            !isCellFilled(cell)
            && !isNoteVisibleInCell(num, cell)
            && !duplicacyPresent(cell, num)
        ) {
            updateNoteInCell(cell, num, false, validityChecksConfig);
            if (getNewCellsListForNum && !cellHasHiddenSingle(cell)) newCells.push_back(cell);
        }
    }
    bool numIsHiddenSingleForCurrentBlock = notesInHouses[num].blocks[filledCellBlockNum].count == 1;
    // if this condition is true then it's guranteed that in the current cell "num" is still 
    // the only choice so we don't have to solve sudoku to be sure. 
    if (getNewCellsListForNum && (numIsNakedSingleForCurrentCell || numIsHiddenSingleForCurrentRow || numIsHiddenSingleForCurrentCol || numIsHiddenSingleForCurrentBlock))
        newCells.clear();

    return newCells;
}

vector <Cell> emptyCell(Cell cell, bool getNewCellsListForNum) {
    int valueToBeRemoved = getCellMainValue(cell);
    mainNumbers[cell.row][cell.col].value = 0;
    updateDuplicacyCheckerStore(cell, valueToBeRemoved-1);
    // 1. return new cells where "valueToBeRemoved" can be placed after removing it from current cell
    // 2. newCells won't have current cell in the list
    return updateNotesAfterEmptyCell(cell, valueToBeRemoved-1, getNewCellsListForNum);
}

int getFilledCellsCount() {
    int count=0;
    for (int row=0;row<9;row++) {
        for (int col=0;col<9;col++) {
            Cell cell = {row, col};
            if (isCellFilled(cell)) count++;
        }
    }
    return count;
}

Cell getCellToStartRecursionFrom() {
    for (int i=0;i<9;i++) {
        for (int j=0;j<9;j++) {
            Cell cell = {i, j};
            if (!isCellFilled(cell)) {
                return cell;
            }
        }
    }
}

// guessing the number in the cell here
int recursion(Cell cell) {
    int numberOfSolutions = 0;
    for (int note=0;note<9;note++) {
        if (isNoteVisibleInCell(note, cell)) {
            // don't search for singles because that "getSolutionsCountForPuzzleType" will do
            Single s = {cell, note};
            bool invalidState = fillCell(s, false);

            if (!invalidState) {
                numberOfSolutions += getSolutionsCountForPuzzleType();
            }

            emptyCell(cell, false);

            if (numberOfSolutions > 1) { 
                
                break;
             }
        }
    }
    return numberOfSolutions;
}

void printBoardState() {
    cout<<"printing board state: "<<endl;
    for(int row=0;row<9;row++){
        for(int col=0;col<9;col++){
            Cell cell = {row, col};
            cout<<getCellMainValue(cell)<<" ";
        }cout<<endl;
    }
}

int getSolutionsCountForPuzzleType() {
    int numberOfSolutions = 0;
    // while filling singles, the function will fill newly generated singles as well
    // and will check for duplicate entries as well, so no need to looping here
    findSingles();	
    FilledSinglesStats stats = fillSingles();
    vector <Cell> cellsFilled = stats.cellsFilled;

    if (!stats.invalidState) { // keep on solving if the state is valid
        int filledCellsCount = getFilledCellsCount();
        if (filledCellsCount == 81) {

            printBoardState();

            numberOfSolutions = 1;
            for (int row=0;row<9;row++) {
                for (int col=0;col<9;col++) {
                    Cell cell = {row, col};
                    mainNumbers[row][col].solutionValue = getCellMainValue(cell);
                }
            }
        } else {
            // human techniques didn't solve completely, now use computer recursion power
            Cell firstEmptyCell = getCellToStartRecursionFrom();
            numberOfSolutions = recursion(firstEmptyCell);

            cout<<"solutions: "<<numberOfSolutions<<endl;

        }
    }

    for (int i=0;i<cellsFilled.size();i++) {
        emptyCell(cellsFilled[i], false);
    }
    return numberOfSolutions;
}

// working good
void initNotesData() {
    for (int row=0;row<9;row++) {
        for (int col=0;col<9;col++) {
            Cell cell = {row, col};
            CellNotes defaultNotes;
            if (isCellFilled(cell)) {
                boardNotes[row][col] = defaultNotes;
            } else {
                for (int num=1;num<=9;num++) {
                    if (!isMainNumberPresentInAnyHouseOfCell(num, cell)) {
                        defaultNotes.visible[num-1] = 1;
                        defaultNotes.count++;
                    }
                }
                boardNotes[row][col] = defaultNotes;
            }
        }
    }
}

// working good
void initNotesInstancesInHousesInfo() {

    for (int note=1;note<=9;note++) {
        NoteInHouses noteHousePlacesInfo;
        for (int houseNo=0;houseNo<9;houseNo++) {
            NoteInHouse rowHouse, colHouse, blockHouse;
            noteHousePlacesInfo.rows[houseNo] = rowHouse;
            noteHousePlacesInfo.cols[houseNo] = colHouse;
            noteHousePlacesInfo.blocks[houseNo] = blockHouse;
        }
        notesInHouses[note-1] = noteHousePlacesInfo;
	}

    for (int row=0;row<9;row++) {
        for (int col=0;col<9;col++) {
            Cell cell = {row, col};
            if (!isCellFilled(cell)) {
                for (int note=0;note<9;note++) {
                    if (boardNotes[row][col].visible[note]) {
                        House rowHouse = getCellHouseForHouseType(ROW, cell);
                        House colHouse = getCellHouseForHouseType(COL, cell);

                        notesInHouses[note].rows[rowHouse.num].cells[col] = 1;
                        notesInHouses[note].rows[rowHouse.num].count++;

                        notesInHouses[note].cols[colHouse.num].cells[row] = 1;
                        notesInHouses[note].cols[colHouse.num].count++;

                        BlockCell blockCell = getBlockAndBoxNum(cell);
                        notesInHouses[note].blocks[blockCell.blockNum].cells[blockCell.boxNum] = 1;
                        notesInHouses[note].blocks[blockCell.blockNum].count++;
                    }
                }
            }
        }
    }
}

void initializeDuplicacyCheckerStore() {
    for (int houseNo=0;houseNo<9;houseNo++) {
        fill(duplicacyCheckerStore.rows[houseNo], duplicacyCheckerStore.rows[houseNo] + 9, 0);
        fill(duplicacyCheckerStore.cols[houseNo], duplicacyCheckerStore.cols[houseNo] + 9, 0);
        fill(duplicacyCheckerStore.blocks[houseNo], duplicacyCheckerStore.blocks[houseNo] + 9, 0);		
    }
    
    for(int row=0;row<9;row++){
        for(int col=0;col<9;col++){
            Cell cell = {row, col};
            int cellEntry = getCellMainValue(cell);
            if (cellEntry != 0) {
                int entryIndex = cellEntry - 1;
                duplicacyCheckerStore.rows[row][entryIndex] = 1;
                duplicacyCheckerStore.cols[col][entryIndex] = 1;
                BlockCell cellCoordinatesInBlockHouse = getBlockAndBoxNum(cell);
                duplicacyCheckerStore.blocks[cellCoordinatesInBlockHouse.blockNum][entryIndex] = 1;
            }
        }
    }
}

struct PuzzleSolutions {
    int count;
    int solution[81];
};

PuzzleSolutions validatePuzzle(string puzzle) {
    generateMainNumbersFromPuzzleString(puzzle);
    
    initNotesData(); // DS for naked singles and in general as well
	initNotesInstancesInHousesInfo(); // DS for hidden singles
    initializeDuplicacyCheckerStore();

    int solutionsCount = getSolutionsCountForPuzzleType();

    PuzzleSolutions result;
    result.count = solutionsCount;
    for(int row=0;row<9;row++){
        for(int col=0;col<9;col++){
            int cellNum = row * HOUSES_COUNT + col;
            result.solution[cellNum] = mainNumbers[row][col].solutionValue;
        }
    }

    return result;
}

int main() {
    // string puzzle = "900008000000004027061027000095000004080010090600000780000850140850600000000300002";
    // string puzzle = "615030700000790010040005030000523090520000008400068000306080970200479006974356281";
    // string puzzle = "409300781320700409700000000600050000050871040000040002000000008506007094178004506";
    // string puzzle = "378659214154328769629471538743005692862947351915236847487593126236004975591762483";

    string puzzle = "000500786007200300000037520406700002320460057070000460000170008789050000100008075";



    PuzzleSolutions ps = validatePuzzle(puzzle);

    cout<<ps.count<<endl;
    for(int row=0;row<9;row++){
        for(int col=0;col<9;col++){
            int cellNum = row * HOUSES_COUNT + col;
            cout<<ps.solution[cellNum]<<",";
        }
    }

    // INIT_TIMER
    // START_TIMER
    // STOP_TIMER("algo completion")

    return 0;
}
