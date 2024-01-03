function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
      strHTML += '<tr>\n';
      for (var j = 0; j < board[0].length; j++) {
        var currCell = board[i][j];
        var className = `cell cell-${i}-${j}`;
        className += currCell.isMine ? ' mine': ' hidden';
        // CR: google for oncontextmenu
        strHTML += `<td class="${className}" onmousedown="isRightClick(this, ${i}, ${j},event), setMinesManually(this,${i}, ${j})""></td>\n`
   
      }
    }
    strHTML += '</tr>\n';
  
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
  }
  
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
      var row = []
      for (var j = 0; j < COLS; j++) {
        row.push('')
      }
      mat.push(row)
    }
    return mat
  }
  
  function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
  }
  
  
  function shuffle(numbers){
      var randIdx;
      var keep;
      for (var i = numbers.length - 1; i > 0; i--) {
          randIdx = getRandomInt(0, numbers.length);
      
          keep = numbers[i];
          numbers[i] = numbers[randIdx];
          numbers[randIdx] = keep;
      }
          return numbers;
  }
  function renderTimer() {
    var timeDiff = Date.now() - gTimeStart;
    var seconds = parseInt(timeDiff / 1000);
    var timeDiffStr = timeDiff.toString();
    var ms = timeDiffStr.substring(timeDiffStr.length - 2);
    if (ms.length < 2) {
      ms = `00${ms}`;
    } else if (ms.length < 2) {
      ms = `0${ms}`;
    }
    if (seconds < 10) seconds = `0${seconds}`;
    gSecTime = `${seconds}.${ms}`;
    document.querySelector('.timer').innerText = `${seconds}.${ms}`
  }
  
  function getRandomCell(row, col) {
    var emptyCells = getEmptyCelss(row, col);
    var randomIdx = getRandomInt(0,gBoard.length);
    var emptyCell = emptyCells[randomIdx];
    return emptyCell;
  }
  
  function getSelector(coord) { // {i:3 , j:5}
    return '.cell-' + i + '-' + j // #cell-3-5
  }
  
  function getNeegsLoc(row, col) {
    var neighbors = [];
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            var cell = gBoard[i][j];
            if (cell.isMarked || cell.isShown) continue;
            neighbors.push({i, j}); 
        }
    }
    return neighbors;
  }

