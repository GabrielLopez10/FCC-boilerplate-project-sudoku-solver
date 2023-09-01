// controllers/sudoku-solver.js
class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    } else if
     (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    } else
    return true; 
}

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    for (let i = start; i < start + 9; i++) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (puzzleString[i * 9 + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }

    const emptyIndex = puzzleString.indexOf('.');
    if (emptyIndex === -1) {
      return { solution: puzzleString }; // Return the solved puzzle in the 'solution' property.
    }

    const row = Math.floor(emptyIndex / 9);
    const col = emptyIndex % 9;

    for (let num = 1; num <= 9; num++) {
      const numStr = num.toString();
      if (
        this.checkRowPlacement(puzzleString, row, col, numStr) &&
        this.checkColPlacement(puzzleString, row, col, numStr) &&
        this.checkRegionPlacement(puzzleString, row, col, numStr)
      ) {
        const newPuzzle = puzzleString.slice(0, emptyIndex) + numStr + puzzleString.slice(emptyIndex + 1);
        const solved = this.solve(newPuzzle);
        if (solved.solution) {
          return { solution: solved.solution }; // Return the solved puzzle in the 'solution' property.
        }
      }
    }
    return { error: "No solution found" }; // Return an error if no solution is found.
  }
}

module.exports = SudokuSolver;


