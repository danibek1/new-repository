'use strict';

// var gLevel = {
//     SIZE: 4,
//     MINES: 2
// };

function createBoard() {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = { isMine: false, isShown: false, isMarked: false, visited: false };
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