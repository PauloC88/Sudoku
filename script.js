const gridSize = 9;
let playArea = document.getElementById("play-area");
let rows = [[], [], [], [], [], [], [], [], [], []];
let columns = [[], [], [], [], [], [], [], [], [], []]; 
let squares = matrix(gridSize);

createGrid();

function matrix(n) {
  let result = [];
  for (let i = 0; i <= n; ++i) {
    result.push(new Array(n + 1).fill("0"));
  }
  return result;
}

function createGrid() {
	for (let i = 1; i <= gridSize; ++i) {
    let miniGrid = document.createElement("div");
    miniGrid.classList.add("grid-container");
    miniGrid.setAttribute("id", i);
    playArea.appendChild(miniGrid);
    for (let j = 1; j <= gridSize; ++j) {
      let gridButton = document.createElement("button");
      gridButton.setAttribute("type", "button");
      gridButton.classList.add("grid-button", "main-grid");
      let id = i * 10 + j;
      gridButton.setAttribute("id", id);
      gridButton.onclick = function() {selectNumber(id);};
      miniGrid.appendChild(gridButton);
    }
  }
  let digitsArray = Array.from(Array(gridSize + 1).keys()).slice(1);
  digitsArray.sort(() => 0.5 - Math.random());
  const offsetArray = [1, 2, 4, 5, 7, 8];
  offsetArray.sort(() => 0.5 - Math.random());
  const offset = offsetArray[3];
  for (let i = 1; i <= gridSize; ++i) {
    for (let j = 1; j <= gridSize; ++j) {
      let id = i * 10 + j;
      let gridButton = document.getElementById(id);
      gridButton.innerText = digitsArray[j - 1];
      gridButton.setAttribute("data", digitsArray[j - 1]);
    }
    digitsArray = rotateArray(digitsArray, offset);
  }
  let array = Array.from(Array(gridSize * 11 + 1).keys());
  for (let i = 9; i > 1; --i) {
    array.splice(i * 10, 1);
  }
  array = array.slice(11);
  arrayHalf1 = array.slice(0, 40);
  let blankSquareIds = arrayHalf1.sort(() => 0.5 - Math.random()).slice(0, 20);
  for (let id of blankSquareIds) {
    let blankSquare = document.getElementById(id);
    blankSquare.innerText = "";
    blankSquare.setAttribute("data", 0);
    blankSquare.style.color = "blue";
    blankSquare = document.getElementById(99 - id + 11);
    blankSquare.innerText = "";
    blankSquare.setAttribute("data", 0);
    blankSquare.style.color = "blue";
  }
  for (let i = 1; i <= gridSize; ++i) {
    for (let j = 1; j <= gridSize; ++j) {
      let id = i * 10 + j;
      let filedInDigit = document.getElementById(id).getAttribute("data");
      if (filedInDigit != 0) {
        squares[i][j] = filedInDigit;
        let rowIndex = identifyRow(i, j);
        rows[rowIndex].push(filedInDigit);
        let columnIndex = identifyColumn(i, j);
        columns[columnIndex].push(filedInDigit);
      }
    }
  }
}

function rotateArray(array, offset) {
  for (let i = 0; i < offset; ++i) {
    array.unshift(array.pop());
  }
  return array;
}

function identifyRow(sqIndex, posInsSq) {
  if ((sqIndex === 1 || sqIndex === 4 || sqIndex === 7)) {
    if (posInsSq === 1 || posInsSq === 2 || posInsSq === 3) {
      return 1;
    }
    if (posInsSq === 4 || posInsSq === 5 || posInsSq === 6) {
      return 2;
    }
    return 3;
  }
  if ((sqIndex === 2 || sqIndex === 5 || sqIndex === 8)) {
    if (posInsSq === 1 || posInsSq === 2 || posInsSq === 3) {
      return 4;
    }
    if (posInsSq === 4 || posInsSq === 5 || posInsSq === 6) {
      return 5;
    }
    return 6;
  }
  if (posInsSq === 1 || posInsSq === 2 || posInsSq === 3) {
    return 7;
  }
  if (posInsSq === 4 || posInsSq === 5 || posInsSq === 6) {
    return 8;
  }
  return 9;
}

function identifyColumn(sqIndex, posInsSq) {
  if ((sqIndex === 1 || sqIndex === 2 || sqIndex === 3)) {
    if (posInsSq === 1 || posInsSq === 4 || posInsSq === 7) {
      return 1;
    }
    if (posInsSq === 2 || posInsSq === 5 || posInsSq === 8) {
      return 2;
    }
    return 3;
  }
  if ((sqIndex === 4 || sqIndex === 5 || sqIndex === 6)) {
    if (posInsSq === 1 || posInsSq === 4 || posInsSq === 7) {
      return 4;
    }
    if (posInsSq === 2 || posInsSq === 5 || posInsSq === 8) {
      return 5;
    }
    return 6;
  }
  if (posInsSq === 1 || posInsSq === 4 || posInsSq === 7) {
    return 7;
  }
  if (posInsSq === 2 || posInsSq === 5 || posInsSq === 8) {
    return 8;
  }
  return 9;
}

let gameWon = false;

function selectNumber(id) {
  let digitsGrid = document.getElementById("digits-grid");
  digitsGrid.textContent = "";
  let gridButton = document.getElementById(id);
  if (gridButton.getAttribute("data") == 0) {
    for (let i = 1; i <= gridSize; ++i) {
      let digit = document.createElement("button");
      digit.setAttribute("type", "button");
      digit.classList.add("grid-button", "digit");
      digit.setAttribute("id", i);
      digit.innerText = i;
      digit.onclick = function() {insertNumber(id, i);};
      digitsGrid.appendChild(digit);
      if (gridButton.innerText != "") {
        digit.disabled = true;
      }
    }
    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("grid-button", "delete-button");
    deleteButton.setAttribute("id", "delete");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {deleteNumber(id);};
    digitsGrid.appendChild(deleteButton);
    if (gameWon) {
      deleteButton.disabled = true;
    }
  }
}

function insertNumber(id, digit) {
  let message = document.querySelector("message");
  message.innerHTML = "";
  let gridButton = document.getElementById(id);
  gridButton.innerText = digit;
  gridButton.style.color = "blue";
  let sqIndex = Math.floor(id / 10);
  let posInsSq = id % 10;
  let rowIndex = identifyRow(sqIndex, posInsSq);
  let columnIndex = identifyColumn(sqIndex, posInsSq);
  let charDigit = digit.toString();
  if (!squares[sqIndex].includes(charDigit) && !rows[rowIndex].includes(charDigit) && !columns[columnIndex].includes(charDigit)) {
    squares[sqIndex][posInsSq] = charDigit;
    rows[rowIndex].push(charDigit);
    columns[columnIndex].push(charDigit);
  } else {
    gridButton.style.color = "red";
    message.innerHTML = "<b>&nbsp Not allowed! </b>";
    if (squares[sqIndex].includes(charDigit)) {
      message.innerHTML += "<b>Check square! </b>";
    }
    if (rows[rowIndex].includes(charDigit)) {
      message.innerHTML += "<b>Check row! </b>";
    }
    if (columns[columnIndex].includes(charDigit)) {
      message.innerHTML += "<b>Check column!</b>";
    }
    let gridButtons = document.getElementsByClassName("main-grid");
    for (let gB of gridButtons) {
      gB.onclick = function() {};      
    }
  }
  let digits = document.getElementsByClassName("digit");
  for (let dgt of digits) {
    dgt.disabled = true;
  }
  checkGameWon();
}

function deleteNumber(id) {
  let gridButton = document.getElementById(id);
  let digit = gridButton.innerText;
  gridButton.innerText = "";
  let digits = document.getElementsByClassName("digit");
  for (let dgt of digits) {
    dgt.disabled = false;
  }
  let message = document.querySelector("message");
  if (message.innerHTML == "") {
    let sqIndex = Math.floor(id / 10);
    let posInsSq = id % 10;
    let rowIndex = identifyRow(sqIndex, posInsSq);
    let columnIndex = identifyColumn(sqIndex, posInsSq);
    squares[sqIndex][posInsSq] = "0";
    let index = rows[rowIndex].indexOf(digit);
    rows[rowIndex].splice(index, 1);
    index = columns[columnIndex].indexOf(digit);
    columns[columnIndex].splice(index, 1);
  } else {
    for (let i = 1; i <= gridSize; ++i) {
      for (let j = 1; j <= gridSize; ++j) {
        let gridBttnId = i * 10 + j;
        let gridBttn = document.getElementById(gridBttnId);
        gridBttn.onclick = function() {selectNumber(gridBttnId);};
      }
    }
    message.innerHTML = "";
  }
}

function checkGameWon() {
  gameWon = true;
  let gridButtons = document.getElementsByClassName("main-grid");
  for (let gridButton of gridButtons) {
    if (gridButton.innerText == "") {
      gameWon = false;
    }
  }
  let message = document.querySelector("message");
  if (message.innerHTML != "") {
    gameWon = false;
  }
  if (gameWon) {
    message.innerHTML = "<p style=\"color: green; font-size: 18px;\"><b>&nbsp Congrats!!! You solved the puzzle!</b></p>";
    document.getElementById("delete").disabled = true;
  }
}
