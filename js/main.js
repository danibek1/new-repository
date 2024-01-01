'use strict';

var gBoard;
var size = 6;
var startTime;
var markedMinesCount = 0;
var gameOver = false;
var isFirstClick = true;
var totalMarkedMinesCount = 0;

var gLevel = {
    size: 4,  
    mines: 2  
};

function onInit() {
    gBoard = createBoard();
    console.table(gBoard);
    startTime = Date.now();
    setInterval(updateTimer, 1000);
    fillBoardWithRandomCells(gBoard, 5); 
    renderBoard(gBoard);
    document.querySelector('.mines span').innerText = markedMinesCount;
    totalMarkedMinesCount = 100;
    document.querySelector('.sum-container').innerText = totalMarkedMinesCount;
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

function playSoundDeath() {
    var sound = new Audio("sound/explosion.mp3");
    sound.play();
}

function onCellClick(i, j, elCell) {
    if (isFirstClick) {
        isFirstClick = false;
    } else {
      
        var cellContent = gBoard[i][j];

        if (!cellContent.isShown) {
            if (cellContent.isMine) {
                elCell.innerHTML = '💥';
                playSoundDeath()
                endGame(false);
            } else {
                var minesAroundCount = countMinesAround(i, j);
                elCell.innerHTML = minesAroundCount;

                if (minesAroundCount === 0) {
                    revealWide(i, j);
                }
            }

            elCell.classList.remove('hidden');
        }
    }
}


function onCellRightClick(event, i, j, elCell) {
    event.preventDefault();

    var cell = gBoard[i][j];

    if (!cell.isShown) {
        if (cell.isMarked) {
            totalMarkedMinesCount--;
        } else {
            totalMarkedMinesCount--;
        }

        cell.isMarked = !cell.isMarked;
        elCell.innerHTML = cell.isMarked ? '🚩' : '';
        document.querySelector('.sum-container').innerText = totalMarkedMinesCount;
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
    var stack = [{ i, j }];

    while (stack.length > 0) {
        var current = stack.pop();
        var row = current.i;
        var col = current.j;
        var elCell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
        var cell = gBoard[row][col];

        if (!cell.isMine && !cell.isShown) {
            var minesAroundCount = countMinesAround(row, col);
            elCell.innerHTML = minesAroundCount;

            if (minesAroundCount === 0) {
                for (var r = row - 1; r <= row + 1; r++) {
                    for (var c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < size && c >= 0 && c < size) {
                            stack.push({ i: r, j: c });
                        }
                    }
                }
            }

            elCell.classList.remove('hidden');
            cell.isShown = true;
        }
    }
}

function chooseLevel(elSize, elMines) {
    console.log('chooseLevel called with size:', elSize, 'and mines:', elMines);
    gLevel.size = elSize;
    gLevel.mines = elMines;
    onInit();
}

function endGame(isVictory) {
    console.log("endGame called");
    gameOver = true;

    var boardCells = document.querySelectorAll('.my-table td');
    boardCells.forEach(function (cell) {
        cell.onclick = null;
        cell.oncontextmenu = null;
    });
}

function restartGame() {
    onInit();
}
