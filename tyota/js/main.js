'use strict';

var gBoard;
var size = 6;
var startTime;
var gameOver = false;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

function onInit() {
    gBoard = createBoard();
    console.table(gBoard);
    startTime = Date.now();
    setInterval(updateTimer, 1000);
    fillBoardWithRandomCells(gBoard, 5); // Change 5 to the desired count
    renderBoard(gBoard);
}

function createBoard() {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = { isMine: false, isShown: false, isMarked: false };
        }
    }
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < size; i++) {
        strHtml += `<tr>`;
        for (var j = 0; j < size; j++) {
            strHtml += `<td 
                onclick="onCellClick(${i},${j}, this)" 
                oncontextmenu="onCellRightClick(event, ${i},${j}, this); return false;" 
                data-i="${i}" data-j="${j}" 
                class="${board[i][j].isShown ? '' : 'hidden'}">
                ${board[i][j].isShown ? (board[i][j].isMine ? '💥' : '') : ''}
            </td>`;
        }
        strHtml += `</tr>`;
    }
    const elBoard = document.querySelector('.my-table');
    elBoard.innerHTML = strHtml;
}

function updateTimer() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;
    var seconds = Math.floor(elapsedTime / 1000);
    var minutes = Math.floor(seconds / 60);

    var timerElement = document.getElementById('timer');
    timerElement.innerHTML = 'timer:' + seconds % 60 + 's';
}

function fillBoardWithRandomCells(board, count) {
    var availablePositions = [];

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            availablePositions.push({ i: i, j: j });
        }
    }

    shuffleArray(availablePositions);

    for (var idx = 0; idx < count; idx++) {
        var randomPosition = availablePositions[idx];
        board[randomPosition.i][randomPosition.j].isMine = true;
    }
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

    // var clickSound = new Audio('sound_explosion.mp3.mp3'); 
  
function onCellClick(i, j, elCell) {
    var cellContent = gBoard[i][j];

    if (cellContent.isMine) {
        elCell.innerHTML = '💥';
        endGame(false); 
    } else {
        var minesAroundCount = countMinesAround(i, j);
        elCell.innerHTML = minesAroundCount;

        // צפה במספר המוקשים מסביב בצורה רחבה
        if (minesAroundCount === 0) {
            revealWide(i, j);
        }
    }

    elCell.classList.remove('hidden'); // הסר את המחלקה 'hidden' כדי להציג את התוכן של התא
}

function onCellRightClick(event, i, j, elCell) {
    event.preventDefault();

    var cell = gBoard[i][j];

    if (!cell.isShown) {
        cell.isMarked = !cell.isMarked;
        elCell.innerHTML = cell.isMarked ? '🚩' : '';
    }
}

function countMinesAround(i, j) {
    var count = 0;

    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (row >= 0 && row < size && col >= 0 && col < size) {
                if (gBoard[row][col].isMine) {
                    count++;
                }
            }
        }
    }

    return count;
}
function revealWide(i, j) {
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (row >= 0 && row < size && col >= 0 && col < size) {
                var elCell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
                var cell = gBoard[row][col];

                // נוסיף תנאי נוסף - תא שכבר נפתח או שנמסר יחסית
                if (elCell.innerHTML === '' && !cell.isMine && !cell.visited) {
                    var minesAroundCount = countMinesAround(row, col);
                    elCell.innerHTML = minesAroundCount;
                    cell.visited = true;

                    if (minesAroundCount === 0) {
                        revealWide(row, col);
                    }
                }
            }
        }
    }
}


function endGame(isVictory) {
    console.log("endGame called");
    gameOver = true;

    var boardCells = document.querySelectorAll('.my-table td');
    boardCells.forEach(function(cell) {
        cell.onclick = null;
        cell.oncontextmenu = null;
    });
}

function restartGame() {
    onInit();
}
