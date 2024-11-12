// Variáveis Globais
const ROWS = 7;
const COLS = 8;
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
    selectedAlgorithm = document.getElementById('algorithm').value;
    searchDepth = parseInt(document.getElementById('depth').value);
    renderBoard();
}

// Renderizar o Tabuleiro
function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (board[row][col] === humanPlayer) {
                cell.classList.add("red");
            } else if (board[row][col] === aiPlayer) {
                cell.classList.add("yellow");
            } else {
                cell.style.backgroundColor = "white";
                cell.addEventListener("click", () => {
                    if (currentPlayer === humanPlayer) makeMove(col);
                });
            }

            boardDiv.appendChild(cell);
        }
    }
}

// Fazer Jogada
function makeMove(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            renderBoard();

            if (checkWin(row, col)) {
                // Aguarda 500 ms antes de exibir o alerta, para garantir que o movimento final é exibido
                setTimeout(() => {
                    alert(`${currentPlayer === humanPlayer ? "Você venceu!" : "A IA venceu!"}`);
                    startGame();
                }, 500);
                return;
            } else if (board.flat().every(cell => cell)) {
                setTimeout(() => {
                    alert("O jogo terminou em empate!");
                    startGame();
                }, 500);
                return;
            } else {
                currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
                if (currentPlayer === aiPlayer) {
                    setTimeout(makeAiMove, 500); // Atraso para a jogada da IA
                }
            }
            return;
        }
    }
    alert("A coluna está cheia!");
}

// Função de Jogada da IA
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

// Função de Avaliação
function evaluateBoard(board) {
    let score = 0;

    // Função para avaliar segmentos de 4 células
    function evaluateSegment(segment) {
        let score = 0;
        const countAI = segment.filter(cell => cell === aiPlayer).length;
        const countHuman = segment.filter(cell => cell === humanPlayer).length;

        if (countAI === 4) score += 100;
        else if (countAI === 3 && countHuman === 0) score += 10;
        else if (countAI === 2 && countHuman === 0) score += 5;
        else if (countHuman === 3 && countAI === 0) score -= 80;
        
        return score;
    }

    // Avaliar linhas, colunas e diagonais
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

// Função Minimax
function getBestMoveMinimax(board, depth, isMaximizingPlayer) {
    if (depth === 0 || checkWin() || isBoardFull(board)) {
        return evaluateBoard(board);
    }

    let bestMove = null;
    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let col = 0; col < COLS; col++) {
        const tempBoard = makeTempMove(board, col, isMaximizingPlayer ? aiPlayer : humanPlayer);
        if (tempBoard) {
            const score = getBestMoveMinimax(tempBoard, depth - 1, !isMaximizingPlayer);

            if (isMaximizingPlayer) {
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = col;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = col;
                }
            }
        }
    }
    return depth === searchDepth ? bestMove : bestScore;
}

// Função Alfa-Beta
function getBestMoveAlphaBeta(board, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || checkWin() || isBoardFull(board)) {
        return evaluateBoard(board);
    }

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


// Helper para verificar se o tabuleiro está cheio
function isBoardFull(board) {
    return board.flat().every(cell => cell !== null);
}

// Helper para fazer jogada temporária
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

// Verificação de Vitória
function checkWin(row, col) {
    const directions = [
        { dr: 0, dc: 1 }, // Horizontal
        { dr: 1, dc: 0 }, // Vertical
        { dr: 1, dc: 1 }, // Diagonal para baixo-direita
        { dr: 1, dc: -1 } // Diagonal para baixo-esquerda
    ];

    for (let { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) return true;
    }
    return false;
}

startGame();  // Começar o jogo
