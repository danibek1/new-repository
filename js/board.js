'use strict';

var size = 6;

function createBoard(gLevel) {
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
            var cell = board[i][j];
            var classes = `class="${cell.isShown ? '' : 'hidden'} ${cell.isMine ? 'mine' : ''} number-${cell.value}"`;
            strHtml += `<td 
                        onclick="onCellClick(${i},${j}, this)" 
                        oncontextmenu="onCellRightClick(event, ${i},${j}, this); return false;" 
                        data-i="${i}" data-j="${j}" 
                        ${classes}>
                        ${cell.isShown ? (cell.isMine ? '💥' : cell.value) : ''}
                    </td>`;
        }
        strHtml += `</tr>`;
    }
    const elBoard = document.querySelector('.my-table');
    elBoard.innerHTML = strHtml;
}



