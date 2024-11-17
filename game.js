

// Variáveis Globais
const ROWS = 6; // Número de linhas no tabuleiro
const COLS = 7; // Número de colunas no tabuleiro
let board;
let currentPlayer;
let aiPlayer = 'O';
let humanPlayer = 'X';
let selectedAlgorithm;
let searchDepth;

// Iniciar o Jogo
function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = humanPlayer;
    selectedAlgorithm = document.getElementById('algorithm').value || "minimax";
    searchDepth = parseInt(document.getElementById('depth').value) || 4;
    renderBoard();
}

// Renderizar o Tabuleiro
function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    boardDiv.style.display = "grid";
    boardDiv.style.gridTemplateRows = `repeat(${ROWS}, 50px)`;
    boardDiv.style.gridTemplateColumns = `repeat(${COLS}, 50px)`;
    boardDiv.style.gap = "2px";

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.style.border = "1px solid black";
            cell.style.display = "flex";
            cell.style.justifyContent = "center";
            cell.style.alignItems = "center";
            cell.style.fontSize = "24px";
            cell.style.cursor = "pointer";
            cell.style.backgroundColor = board[row][col] === humanPlayer ? "red" : 
                                         board[row][col] === aiPlayer ? "yellow" : "white";

            if (!board[row][col]) {
                cell.addEventListener("click", () => {
                    if (currentPlayer === humanPlayer) makeMove(col);
                });
            }

            boardDiv.appendChild(cell);
        }
    }
}

// Código de teste no mesmo arquivo script.js
function testPerformance(board, depth) {
    console.log("==== Testando Minimax ====");
    console.time(`Minimax Depth ${depth}`);
    getBestMoveMinimax(board, depth, true);
    console.timeEnd(`Minimax Depth ${depth}`);

    console.log("==== Testando Poda Alfa-Beta ====");
    console.time(`Alpha-Beta Depth ${depth}`);
    getBestMoveAlphaBeta(board, depth, -Infinity, Infinity, true);
    console.timeEnd(`Alpha-Beta Depth ${depth}`);
}


// Fazer Jogada
function makeMove(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            renderBoard();

            if (checkWin(row, col)) {
                setTimeout(() => {
                    alert(`${currentPlayer === humanPlayer ? "Você venceu!" : "A IA venceu!"}`);
                    startGame();
                }, 500);
                return;
            } else if (isBoardFull(board)) {
                setTimeout(() => {
                    alert("O jogo terminou em empate!");
                    startGame();
                }, 500);
                return;
            } else {
                currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
                if (currentPlayer === aiPlayer) {
                    setTimeout(makeAiMove, 500);
                }
            }
            return;
        }
    }
    alert("A coluna está cheia!");
}

// Jogada da IA
function makeAiMove() {
    console.time("Tempo de execução da IA");

    let bestMove;
    if (selectedAlgorithm === "minimax") {
        bestMove = getBestMoveMinimax(board, searchDepth, true);
    } else if (selectedAlgorithm === "alphabeta") {
        bestMove = getBestMoveAlphaBeta(board, searchDepth, -Infinity, Infinity, true);
    }

    console.timeEnd("Tempo de execução da IA");

    if (bestMove !== undefined) {
        makeMove(bestMove);
    }
}

// Função de Avaliação do Tabuleiro
function evaluateBoard(board) {
    let score = 0;

    function evaluateSegment(segment) {
        const countAI = segment.filter(cell => cell === aiPlayer).length;
        const countHuman = segment.filter(cell => cell === humanPlayer).length;

        if (countAI === 4) return 1000;
        if (countHuman === 4) return -1000;
        if (countAI === 3 && countHuman === 0) return 50;
        if (countHuman === 3 && countAI === 0) return -50;
        if (countAI === 2 && countHuman === 0) return 10;
        if (countHuman === 2 && countAI === 0) return -10;
        return 0;
    }

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS - 3; col++) {
            score += evaluateSegment([board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]]);
        }
    }

    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS - 3; row++) {
            score += evaluateSegment([board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]]);
        }
    }

    for (let row = 0; row < ROWS - 3; row++) {
        for (let col = 0; col < COLS - 3; col++) {
            score += evaluateSegment([board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]]);
            score += evaluateSegment([board[row][col + 3], board[row + 1][col + 2], board[row + 2][col + 1], board[row + 3][col]]);
        }
    }

    return score;
}

// Minimax e Alfa-Beta Implementações
function getBestMoveMinimax(board, depth, isMaximizingPlayer) {
    if (depth === 0 || isBoardFull(board)) return evaluateBoard(board);

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove = null;

    for (let col = 0; col < COLS; col++) {
        const tempBoard = makeTempMove(board, col, isMaximizingPlayer ? aiPlayer : humanPlayer);
        if (tempBoard) {
            const score = getBestMoveMinimax(tempBoard, depth - 1, !isMaximizingPlayer);
            if (isMaximizingPlayer ? score > bestScore : score < bestScore) {
                bestScore = score;
                bestMove = col;
            }
        }
    }
    return depth === searchDepth ? bestMove : bestScore;
}

function getBestMoveAlphaBeta(board, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || isBoardFull(board)) return evaluateBoard(board);

    let bestMove = null;

    for (let col = 0; col < COLS; col++) {
        const tempBoard = makeTempMove(board, col, isMaximizingPlayer ? aiPlayer : humanPlayer);
        if (tempBoard) {
            const score = getBestMoveAlphaBeta(tempBoard, depth - 1, alpha, beta, !isMaximizingPlayer);

            if (isMaximizingPlayer) {
                if (score > alpha) {
                    alpha = score;
                    bestMove = col;
                }
                if (alpha >= beta) break;
            } else {
                if (score < beta) {
                    beta = score;
                    bestMove = col;
                }
                if (alpha >= beta) break;
            }
        }
    }
    return depth === searchDepth ? bestMove : (isMaximizingPlayer ? alpha : beta);
}

// Helpers
function isBoardFull(board) {
    return board.flat().every(cell => cell !== null);
}

function makeTempMove(board, col, player) {
    const newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!newBoard[row][col]) {
            newBoard[row][col] = player;
            return newBoard;
        }
    }
    return null;
}

function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
        { dr: 1, dc: 1 },
        { dr: 1, dc: -1 }
    ];

    for (let { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) count++;
            else break;
        }
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) count++;
            else break;
        }
        if (count >= 4) return true;
    }
    return false;
}

// Código de teste no mesmo arquivo script.js
function testPerformance(board, depth) {
    // Garantir que os testes são feitos separadamente
    console.log("==== Iniciando Teste de Desempenho ====");

    // Testando Minimax
    if (selectedAlgorithm === "minimax") {
        console.log("==== Testando Minimax ====");
        console.time(`Minimax Depth ${depth}`);
        const minimaxResult = getBestMoveMinimax(board, depth, true); // Rodando o Minimax
        console.timeEnd(`Minimax Depth ${depth}`);
        console.log("Resultado Minimax:", minimaxResult);
    }

    // Testando Poda Alfa-Beta
    if (selectedAlgorithm === "alphabeta") {
        console.log("==== Testando Poda Alfa-Beta ====");
        console.time(`Alpha-Beta Depth ${depth}`);
        const alphaBetaResult = getBestMoveAlphaBeta(board, depth, -Infinity, Infinity, true); // Rodando o Alpha-Beta
        console.timeEnd(`Alpha-Beta Depth ${depth}`);
        console.log("Resultado Poda Alfa-Beta:", alphaBetaResult);
    }
}

// Definindo board para o teste
const testBoard = Array.from({ length: 6 }, () => Array(7).fill(null)); // Tabuleiro de 6x7
startGame();  // Iniciar o jogo

selectedAlgorithm = "minimax"; // Pode ser "alphabeta" ou "minimax"
testPerformance(testBoard, 3); // Testar com profundidade 3
