// Variáveis do Jogo
const ROWS = 7;
const COLS = 8;
let board;
let currentPlayer;

// Iniciar o Jogo
function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'X';
    renderBoard();
}

// Renderizar o Tabuleiro
function renderBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => makeMove(col);
            if (board[row][col] === 'X') cell.classList.add('player1');
            if (board[row][col] === 'O') cell.classList.add('player2');
            boardDiv.appendChild(cell);
        }
    }
}

// Fazer Jogada
function makeMove(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            if (checkWin(row, col)) {
                alert(`${currentPlayer} Wins!`);
                startGame();
            } else if (board.flat().every(cell => cell)) {
                alert("It's a Draw!");
                startGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                renderBoard();
            }
            return;
        }
    }
    alert("Column is full!");
}

// Verificar Condição de Vitória
function checkWin(row, col) {
    return (
        checkDirection(row, col, 1, 0) ||  // Horizontal
        checkDirection(row, col, 0, 1) ||  // Vertical
        checkDirection(row, col, 1, 1) ||  // Diagonal \
        checkDirection(row, col, 1, -1)    // Diagonal /
    );
}

function checkDirection(row, col, rowStep, colStep) {
    let count = 0;
    let r = row;
    let c = col;
    while (isInBounds(r, c) && board[r][c] === currentPlayer) {
        count++;
        r += rowStep;
        c += colStep;
    }
    r = row - rowStep;
    c = col - colStep;
    while (isInBounds(r, c) && board[r][c] === currentPlayer) {
        count++;
        r -= rowStep;
        c -= colStep;
    }
    return count >= 4;
}

function isInBounds(row, col) {
    return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}
