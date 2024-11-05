// Função de Avaliação
function evaluateBoard(board) {
    // Avaliação simples com base nas possíveis vitórias do jogador
    return 0;
}

// Algoritmo Minimax
function minimax(board, depth, isMaximizing) {
    if (depth === 0 || checkWinCondition()) {
        return evaluateBoard(board);
    }

    let bestValue = isMaximizing ? -Infinity : Infinity;
    for (let col = 0; col < COLS; col++) {
        // Realizar uma cópia do estado atual e simular uma jogada
        const newBoard = makeMoveOnCopy(board, col, isMaximizing ? 'X' : 'O');
        const value = minimax(newBoard, depth - 1, !isMaximizing);
        bestValue = isMaximizing ? Math.max(bestValue, value) : Math.min(bestValue, value);
    }
    return bestValue;
}

// Algoritmo de Poda Alfa-Beta
function minimaxAlphaBeta(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || checkWinCondition()) {
        return evaluateBoard(board);
    }

    let bestValue = isMaximizing ? -Infinity : Infinity;
    for (let col = 0; col < COLS; col++) {
        const newBoard = makeMoveOnCopy(board, col, isMaximizing ? 'X' : 'O');
        const value = minimaxAlphaBeta(newBoard, depth - 1, alpha, beta, !isMaximizing);
        
        if (isMaximizing) {
            bestValue = Math.max(bestValue, value);
            alpha = Math.max(alpha, bestValue);
        } else {
            bestValue = Math.min(bestValue, value);
            beta = Math.min(beta, bestValue);
        }

        if (beta <= alpha) break; // Poda
    }
    return bestValue;
}

function makeMoveOnCopy(board, col, player) {
    const newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!newBoard[row][col]) {
            newBoard[row][col] = player;
            break;
        }
    }
    return newBoard;
}
