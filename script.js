const ROWS = 6;
const COLS = 7;
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

let board = [];
let currentPlayer = 1; // 1 para Jugador 1 (Rojo), 2 para Jugador 2 (Amarillo)
let gameActive = true;

// Inicializa y dibuja el tablero (Mantiene la función original)
function initializeBoard() {
    board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
    boardElement.innerHTML = ''; 

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (r === 0) {
                cell.addEventListener('click', () => handleCellClick(c));
            }

            boardElement.appendChild(cell);
        }
    }
    currentPlayer = 1; // Aseguramos que empiece el Jugador 1
    gameActive = true;
    updateStatus();
}

// Actualiza el texto de estado del juego (Mantiene la función original, pero ahora llamada correctamente)
function updateStatus(winner = 0) {
    if (winner !== 0) {
        // Muestra el ganador si se pasa el argumento 'winner'
        const winnerColor = winner === 1 ? 'Rojo' : 'Amarillo';
        statusElement.textContent = `¡Gana el Jugador ${winner} (${winnerColor})! 🥳`;
    } else if (checkTie()) {
        // Comprueba si hay empate
        statusElement.textContent = `¡Empate! 🤝`;
        gameActive = false; // Asegurar que se detiene el juego en caso de empate
    } else {
        // Muestra el turno normal
        const color = currentPlayer === 1 ? 'Rojo' : 'Amarillo';
        statusElement.textContent = `Turno: Jugador ${currentPlayer} (${color})`;
    }
}

// Maneja el clic en una columna (CORRECCIÓN CLAVE AQUÍ)
function handleCellClick(col) {
    if (!gameActive) return;

    let lowestEmptyRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            lowestEmptyRow = r;
            break;
        }
    }

    if (lowestEmptyRow !== -1) {
        // Coloca la ficha en el modelo de datos
        board[lowestEmptyRow][col] = currentPlayer;
        
        // Dibuja la ficha en la celda
        drawPiece(lowestEmptyRow, col, currentPlayer);

        // 1. COMPROBAR VICTORIA CON EL JUGADOR ACTUAL
        if (checkWin(board, currentPlayer)) {
            gameActive = false;
            // Llama a updateStatus pasando el ganador
            updateStatus(currentPlayer); 
        } 
        // 2. COMPROBAR EMPATE
        else if (checkTie()) {
            gameActive = false;
            updateStatus(); // Sin argumento, mostrará el mensaje de empate
        } 
        // 3. CAMBIAR TURNO
        else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
        }
    }
}

// Dibuja la ficha en la celda del HTML (Mantiene la función original)
function drawPiece(row, col, player) {
    const cellIndex = row * COLS + col;
    const cellElement = boardElement.children[cellIndex];

    const piece = document.createElement('div');
    piece.classList.add('piece', `player${player}`);
    cellElement.appendChild(piece);
}

// Reinicia el juego
resetButton.addEventListener('click', initializeBoard);

// Detección de 4 en raya (Mantiene la función original)
function checkWin(currentBoard, player) {
    
    function checkDirection(r, c, dr, dc) {
        let count = 0;
        for (let i = 0; i < 4; i++) {
            const row = r + i * dr;
            const col = c + i * dc;
            if (row >= 0 && row < ROWS && col >= 0 && col < COLS && currentBoard[row][col] === player) {
                count++;
            } else {
                break;
            }
        }
        return count === 4;
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (currentBoard[r][c] === player) {
                if (checkDirection(r, c, 0, 1)) return true; // Horizontal
                if (checkDirection(r, c, 1, 0)) return true; // Vertical
                if (checkDirection(r, c, 1, 1)) return true; // Diagonal Derecha Abajo
                if (checkDirection(r, c, 1, -1)) return true; // Diagonal Izquierda Abajo
            }
        }
    }
    return false;
}

// Comprueba si hay empate (Mantiene la función original)
function checkTie() {
    // Si la fila superior (índice 0) no tiene ceros (vacíos), el tablero está lleno
    return board[0].every(cell => cell !== 0);
}


// Inicia el juego al cargar la página
initializeBoard();