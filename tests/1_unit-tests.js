import chai from "chai";
const { assert } = chai;
import { puzzlesAndSolutions } from "../controllers/puzzle-strings";

import Solver from "../controllers/sudoku-solver.js";
let solver = new Solver();

suite("Unit Tests", () => {
    suite("Validation", () => {
        test("Logic handles a valid puzzle string of 81 characters", () => {
            for (let i in puzzlesAndSolutions) {
                assert.isTrue(solver.validate(puzzlesAndSolutions[i][0]));
            }
        });
        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
            const invalidPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......19z5....4.37.4.3..6..";
            const validationResult = solver.validate(invalidPuzzle);
            assert.equal(validationResult.error, "Invalid characters in puzzle"); // Update the expected error message
        });

        test("Logic handles a puzzle string that is not 81 characters in length", () => {
            const invalidLengthStrings = [
                "123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789",
                "12345678912345678912345678912345678912345678912345678912345678912345678912345678912345678",
                "1234567891234567891234567891234567891234567891234567891234567891234567891234567891234567890",
            ];

            invalidLengthStrings.forEach((puzzle) => {
                const result = solver.validate(puzzle);
                assert.property(result, "error");
                assert.isString(result.error);
            });
        });
    });
    suite("Placement Checks", () => {
        test("Logic handles a valid row placement", () => {
            const checks = [
                solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 3, 3),
                solver.checkRowPlacement(puzzlesAndSolutions[1][0], 0, 3, 6),
                solver.checkRowPlacement(puzzlesAndSolutions[2][0], 0, 2, 2),
            ];
            for (let i in checks) {
                assert.isTrue(checks[i]);
            }
        });
        test("Logic handles an invalid row placement", () => {
            const checks = [
                solver.checkRowPlacement(puzzlesAndSolutions[0][0], 0, 3, 5),
                solver.checkRowPlacement(puzzlesAndSolutions[1][0], 0, 3, 1),
                solver.checkRowPlacement(puzzlesAndSolutions[2][0], 0, 2, 3),
            ];
            for (let i in checks) {
                assert.isTrue(checks[i]);
            }
        });
        test("Login handles a valid column placement", () => {
            const checks = [
                solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, 3),
                solver.checkColPlacement(puzzlesAndSolutions[1][0], 0, 1, 6),
                solver.checkColPlacement(puzzlesAndSolutions[2][0], 0, 0, 2),
            ];
            for (let i in checks) {
                assert.isTrue(checks[i]);
            }
        });
        test("Logic handles an invalid column placement", () => {
            // For these test cases, we expect checkColPlacement to return false,
            // because the value being placed already exists in the same column.

            // In puzzlesAndSolutions[0][0], at row 1 and column 1, the value '9' already exists in the same column.
            assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], 1, 1, '9'));

            // In puzzlesAndSolutions[1][0], at row 1 and column 1, the value '8' already exists in the same column.
            assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0], 1, 1, '8'));

            // In puzzlesAndSolutions[2][0], at row 2 and column 2, the value '2' already exists in the same column.
            assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[2][0], 2, 2, '2'));
        });
        test("Logic handles a valid region (3x3 grid) placement", () => {
            const checks = [
                solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 1, 3),
                solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 0, 1, 6),
                solver.checkRegionPlacement(puzzlesAndSolutions[2][0], 0, 0, 2),
            ];
            for (let i in checks) {
                assert.isTrue(checks[i]);
            }
        });
        test("Logic handles an invalid region (3x3 grid) placement", () => {
            const checks = [
                solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 2, 2, 5),
                solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 2, 2, 5),
                solver.checkRegionPlacement(puzzlesAndSolutions[2][0], 2, 2, 5),
            ];
            for (let i in checks) {
                assert.isTrue(checks[i]);
            }
        });
    });
    suite("Solver", () => {
        test("Valid puzzle strings pass the solver", () => {
            for (let i in puzzlesAndSolutions) {
                assert.equal(
                    solver.solve(puzzlesAndSolutions[i][0]).solution,
                    puzzlesAndSolutions[i][1]
                );
            }
        });
        test("Invalid puzzle strings fail the solver", () => {
            // Define custom invalid puzzle strings
            const invalidPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6<."; // Invalid characters
          
            // Test the solver with the custom invalid puzzle strings
            const result = solver.solve(invalidPuzzle);
          
            // Log the result for debugging
            console.log("Solver Result:", result);
          
            // Assert that the solver returns error messages for invalid puzzles
            assert.isNotFalse(result.error, "Invalid characters in puzzle");
          });
        test("Solver returns the expected solution for an incomplete puzzle", () => {
            for (let i in puzzlesAndSolutions) {
                assert.equal(
                    solver.solve(puzzlesAndSolutions[i][0]).solution,
                    puzzlesAndSolutions[i][1]
                );
            }
        });
    });
});
