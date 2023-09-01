'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    if (!(req.body.value > 0) || !(req.body.value < 10)) {
      return res.json({ error: 'Invalid value' });
    }

    if (!/^[A-I][1-9]$/.test(req.body.coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    const puzzleString = req.body.puzzle;

    // Check if the puzzleString length is exactly 81 characters
    if (puzzleString.length !== 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // Check for invalid characters in the puzzle
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }
    const validString = solver.validate(req.body.puzzle);
    if (validString !== true) {
      return res.json(validString);
    }

    const row = req.body.coordinate[0].charCodeAt(0) - 65;
    const col = req.body.coordinate[1] - 1;
    const conflict = [];

    // Check if the value at the specified coordinate matches the submitted value
    if (req.body.puzzle[row * 9 + col] === req.body.value.toString()) {
      return res.json({ valid: true });
    }

    if (!solver.checkRowPlacement(req.body.puzzle, row, col, req.body.value)) {
      conflict.push('row');
    }

    if (!solver.checkColPlacement(req.body.puzzle, row, col, req.body.value)) {
      conflict.push('column');
    }

    if (!solver.checkRegionPlacement(req.body.puzzle, row, col, req.body.value)) {
      conflict.push('region');
    }

    const valid = conflict.length === 0;

    res.json({ valid, conflict });
  });

  app.route('/api/solve').post((req, res) => {
    if (!req.body.puzzle) {
      return res.json({ error: 'Required field missing' });
    }

    const puzzleString = req.body.puzzle;

    if (puzzleString.length !== 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    const solvedPuzzle = solver.solve(puzzleString);

  if (!solvedPuzzle.solution) {
    return res.json({ error: 'Puzzle cannot be solved' });
  }

  res.json({ solution: solvedPuzzle.solution }); // Return the solution in the 'solution' property.
  });

};
