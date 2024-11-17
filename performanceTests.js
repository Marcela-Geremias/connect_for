// Teste de desempenho Minimax e Poda Alfa-Beta
export function testPerformance(board, depth) {
    console.log("==== Testando Minimax ====");
    console.time(`Minimax Depth ${depth}`);
    getBestMoveMinimax(board, depth, true);
    console.timeEnd(`Minimax Depth ${depth}`);

    console.log("==== Testando Poda Alfa-Beta ====");
    console.time(`Alpha-Beta Depth ${depth}`);
    getBestMoveAlphaBeta(board, depth, -Infinity, Infinity, true);
    console.timeEnd(`Alpha-Beta Depth ${depth}`);
}
