
'use strict';

var gBoard;
var startTime;
var numberColor = ''
var minesCount = 2;
var clickCount = 0;
var gameOver = false;
var isFirstClick = true;
var revealedCount = 0;
var remainingLives = 3;
var markedMinesCount = 0;
var totalMarkedMinesCount = 0;

var gLevel = {
    size: 4,
    mines: 2
};

const EASY = { size: 4, mines: 3 };
const HARD = { size: 8, mines: 12 };
const EXTREME = { size: 12, mines: 30 };


function onInit() {
    remainingLives = 3;
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

    var timerElement = document.getElementById('timer');
    timerElement.innerHTML = 'timer:' + seconds % 60 + 's';
}

function chooseLevel(level) {
    console.log('chooseLevel called with size:', level.size, 'and mines:', level.mines);
    gLevel.size = level.size;
    gLevel.mines = level.mines;

    size = level.size;
    minesCount = level.mines;
    onInit();
}

function fillBoardWithRandomCells(board, count) {
    var availablePositions = [];

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            availablePositions.push({ i: i, j: j });
        }
    }
    renderBoard(gBoard);

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

function setNumberColor(cell, i, j) {
    var minesAroundCount = countMinesAround(i, j);

    switch (minesAroundCount) {
        case 1:
            cell.valueColor = 'yellow';
            break;
        case 2:
            cell.valueColor = 'green';
            break;
        case 3:
            cell.valueColor = 'red';
            break;
        default:
            cell.valueColor = '';
            break;
    }
}

function playSoundDeath() {
    var sound = new Audio("sound/explosion.mp3");
    sound.play();
}

function revealWide(i, j, depth = 3) {
    var stack = [{ i, j, depth }];

    while (stack.length > 0) {
        var current = stack.pop();
        var row = current.i;
        var col = current.j;
        var elCell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
        var cell = gBoard[row][col];

        if (!cell.isMine && !cell.isShown && current.depth > 0) {
            clickCount++;

            if (clickCount === 3) {
                endGame(false);
            }

            var minesAroundCount = countMinesAround(row, col);
            elCell.innerHTML = minesAroundCount;

            if (minesAroundCount === 0) {
                for (var r = row - 1; r <= row + 1; r++) {
                    for (var c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < size && c >= 0 && c < size) {
                            stack.push({ i: r, j: c, depth: current.depth - 1 });
                        }
                    }
                }
            }

            elCell.classList.remove('hidden');
            setCellColor(row, col, 'lightgray');
            cell.isShown = true;
        }
    }

    if (checkVictory()) {
        endGame(true);
    }
}

function onCellClick(i, j, elCell) {
    if (isFirstClick) {
        isFirstClick = false;
    } else {
        var cellContent = gBoard[i][j];

        if (!cellContent.isShown) {
            if (cellContent.isMine) {
                elCell.innerHTML = '💣';
                playSoundDeath();
                handleMineClick(); 
            } else {
                var minesAroundCount = countMinesAround(i, j);
                elCell.innerHTML = minesAroundCount;

                if (minesAroundCount === 0) {
                    revealWide(i, j);
                    setCellBackgroundColor(elCell, 'lightblue');
                } else {
                    setNumberColor(cellContent, i, j);
                    elCell.style.color = cellContent.valueColor;
                    setCellBackgroundColor(elCell, 'lightblue');
                }
            }

            elCell.classList.remove('hidden');

            if (cellContent.isMine) {
                clickCount++;
                if (clickCount === 3) {
                    endGame(false);

                }
            }
        }
    }
}

function handleMineClick() {
    remainingLives--;
    updateLivesInHTML();

    if (remainingLives === 0) {
        restartGame();
        endGame(false);
    }
}

function updateLivesInHTML() {
    document.querySelector('.life').innerText = 'lives: ' + '💜'.repeat(remainingLives);
}


function onCellRightClick(event, i, j, elCell) {
    event.preventDefault();

    var cell = gBoard[i][j];

    if (!cell.isShown) {
        if (cell.isMarked) {
            totalMarkedMinesCount++;
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

function revealWide(i, j, depth = 4) {
    var stack = [{ i, j, depth }];

    while (stack.length > 0) {
        var current = stack.pop();
        var row = current.i;
        var col = current.j;
        var elCell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
        var cell = gBoard[row][col];

        if (!cell.isMine && !cell.isShown && current.depth > 0) {
            var minesAroundCount = countMinesAround(row, col);
            elCell.innerHTML = minesAroundCount;

            setCellBackgroundColor(elCell, 'lightblue');

            if (minesAroundCount === 0) {
                for (var r = row - 1; r <= row + 1; r++) {
                    for (var c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < size && c >= 0 && c < size) {
                            stack.push({ i: r, j: c, depth: current.depth - 1 });
                        }
                    }
                }
            }

            elCell.classList.remove('hidden');
            cell.isShown = true;
        }
    }

    if (checkVictory()) {
        endGame(true);
    }
}
function setCellBackgroundColor(elCell, color) {
    elCell.style.backgroundColor = color;
}

revealWide(2, 3, 2);

function countRevealedAndFlaggedCells() {
    var revealedAndFlaggedCount = 0;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].revealed || (gBoard[i][j].isMarked && gBoard[i][j].value === '🚩')) {
                revealedAndFlaggedCount++;
            }
        }
    }
    return revealedAndFlaggedCount;
}

// function checkVictory() {
//     for (var i = 0; i < gLevel.size; i++) {
//         for (var j = 0; j < gLevel.size; j++) {
//             var cell = gBoard[i][j];

//             if (!cell.isShown && !cell.totalMarkedMinesCount) {
//                 return true;
//             }
//             if (!cell.isMine && !cell.isShown) {
//                 return false;
//             }
//         }
//     }

//     displayWinMessage();
//     return true;
// }

function displayWinMessage() {
    alert('You won🎉!');
}


function endGame(isVictory) {
    console.log("endGame called");
    gameOver = true;

    var boardCells = document.querySelectorAll('.my-table td');
    boardCells.forEach(function (cell) {
        cell.onclick = null;
        cell.oncontextmenu = null;
    });

    var restartButton = document.querySelector('.restart-button');
    restartButton.style.display = isVictory ? 'none' : 'block';

    if (isVictory) {
        alert('you won🥇!');
    }
}

function restartGame() {
    clickCount = 0;
    isFirstClick = true;
    gameOver = false;

    var restartButton = document.querySelector('.restart-button');
    restartButton.style.display = 'none';

    onInit();
    updateLivesInHTML();
}


