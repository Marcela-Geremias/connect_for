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
                alert(`${currentPlayer === humanPlayer ? "Human" : "AI"} Wins!`);
                startGame();
                return;
            } else if (board.flat().every(cell => cell)) {
                alert("It's a Draw!");
                startGame();
                return;
            } else {
                currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
                if (currentPlayer === aiPlayer) makeAiMove();
            }
            return;
        }
    }
    alert("Column is full!");
}

// Função de Jogada da IA
function makeAiMove() {
    let bestMove;
    if (selectedAlgorithm === "minimax") {
        bestMove = getBestMoveMinimax();
    } else if (selectedAlgorithm === "alphabeta") {
        bestMove = getBestMoveAlphaBeta();
    }

    if (bestMove !== undefined) {
        makeMove(bestMove);
    }
}

// Função de Avaliação
function evaluateBoard() {
    // Função de avaliação básica para a IA (pode ser ajustada)
    return 0;
}

// Função Minimax
function getBestMoveMinimax() {
    // Implementar minimax com profundidade searchDepth
    return Math.floor(Math.random() * COLS); // Escolhe uma coluna aleatória como exemplo
}

// Função Alfa-Beta
function getBestMoveAlphaBeta() {
    // Implementar poda alfa-beta com profundidade searchDepth
    return Math.floor(Math.random() * COLS); // Escolhe uma coluna aleatória como exemplo
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
