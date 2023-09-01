const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const app = require('../server'); // Import your Express app
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings"); // Import your test data

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        // Test 1: Solve a puzzle with a valid puzzle string
        test('Solve a puzzle with valid puzzle string', (done) => {
            chai
                .request(app)
                .post('/api/solve')
                .send({ puzzle: puzzlesAndSolutions[0][0] }) // Use a valid puzzle string
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 2: Solve a puzzle with a missing puzzle string
        test('Solve a puzzle with missing puzzle string', (done) => {
            chai
                .request(app)
                .post('/api/solve')
                .send({}) // Omit the puzzle field
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 3: Solve a puzzle with invalid characters
        test('Solve a puzzle with invalid characters', (done) => {
            chai
                .request(app)
                .post('/api/solve')
                .send({ puzzle: 'invalid_puzzle_string' }) // Use an invalid puzzle string
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 4: Solve a puzzle with incorrect length
        test('Solve a puzzle with incorrect length', (done) => {
            chai
                .request(app)
                .post('/api/solve')
                .send({ puzzle: '123456789' }) // Use a puzzle string with incorrect length
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 5: Solve a puzzle that cannot be solved
        test('Solve a puzzle that cannot be solved', (done) => {
            chai
                .request(app)
                .post('/api/solve')
                .send({ puzzle: '123456789..............' }) // Use an unsolvable puzzle string
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });
    });

    suite('POST /api/check', () => {
        // Test 6: Check a puzzle placement with all fields
        test('Check a puzzle placement with all fields', (done) => {
            const coordinate = 'A1'; // Example coordinate
            const value = 5; // Example value
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use valid data
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 7: Check a puzzle placement with single placement conflict
        test("Check a puzzle placement with single placement conflict", function (done) {
            chai
                .request(app)
                .post("/api/check")
                .send({
                    puzzle: puzzlesAndSolutions[0][0], // Provide a puzzle with a single placement conflict
                    coordinate: "A2", // Adjust the coordinate to have a conflict
                    value: "1", // This value will conflict with the initial placement
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.property(res.body, "valid");
                    assert.isFalse(res.body.valid); // Expect valid to be false
                    assert.property(res.body, "conflict");
                    assert.isArray(res.body.conflict); // Expect an array of conflicts
                    done();
                });
        });
        // Test 8: Check a puzzle placement with multiple placement conflicts
        test('Check a puzzle placement with multiple placement conflicts', (done) => {
            const coordinate = 'A1'; // Example coordinate with multiple conflicts
            const value = 2; // Example value that causes multiple conflicts
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use data with multiple conflicts
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 9: Check a puzzle placement with all placement conflicts
        test('Check a puzzle placement with all placement conflicts', (done) => {
            const coordinate = 'A1'; // Example coordinate with all conflicts
            const value = 8; // Example value that causes all conflicts
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use data with all conflicts
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.property(res.body, 'conflict');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 10: Check a puzzle placement with missing required fields
        test('Check a puzzle placement with missing required fields', (done) => {
            chai
                .request(app)
                .post('/api/check')
                .send({}) // Omit the required fields
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 11: Check a puzzle placement with invalid characters
        test('Check a puzzle placement with invalid characters', (done) => {
            const coordinate = 'A1'; // Example coordinate
            const value = 'invalid'; // Example value with invalid characters
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use data with invalid characters
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 12: Check a puzzle placement with incorrect length
        test('Check a puzzle placement with incorrect length', (done) => {
            const coordinate = 'A1'; // Example coordinate
            const value = 5; // Example value
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: '123456789' }) // Use a puzzle string with incorrect length
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 13: Check a puzzle placement with invalid placement coordinate
        test('Check a puzzle placement with invalid placement coordinate', (done) => {
            const coordinate = 'A10'; // Example invalid coordinate
            const value = 5; // Example value
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use data with invalid coordinate
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });

        // Test 14: Check a puzzle placement with invalid placement value
        test('Check a puzzle placement with invalid placement value', (done) => {
            const coordinate = 'A1'; // Example coordinate
            const value = 10; // Example invalid value
            chai
                .request(app)
                .post('/api/check')
                .send({ puzzle: puzzlesAndSolutions[0][0], coordinate, value }) // Use data with invalid value
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'error');
                    // Add more assertions if needed
                    done();
                });
        });
    });
});


