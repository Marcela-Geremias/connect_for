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

            // Define a cor da célula com base no jogador
            if (board[row][col] === humanPlayer) {
                cell.style.backgroundColor = "red"; // Bolinha vermelha para o jogador humano
            } else if (board[row][col] === aiPlayer) {
                cell.style.backgroundColor = "yellow"; // Bolinha amarela para a IA
            } else {
                cell.style.backgroundColor = "white"; // Células vazias em branco
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
                alert(`${currentPlayer} Wins!`);
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
