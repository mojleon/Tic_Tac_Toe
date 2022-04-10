const GameBoard = {
  render: () => {
    const body = document.querySelector("body");
    const gameboardDiv = document.createElement("div");
    gameboardDiv.classList.add("gameboardDiv");
    body.appendChild(gameboardDiv);

    for (let divIndex = 0; divIndex < 9; divIndex++) {
      GameBoard.placeBlock(gameboardDiv, divIndex);
    }

    GameBoard.placeScoreBoard();
    GamePlay.evenListener();
  },

  placeBlock(gameboardDiv, i) {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add("block");

    const innerDiv = document.createElement("div");
    innerDiv.setAttribute("id", `block_${i}`);

    outerDiv.appendChild(innerDiv);
    gameboardDiv.appendChild(outerDiv);
  },

  placeScoreBoard() {
    const body = document.querySelector("body");
    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("scoreDiv");
    body.appendChild(scoreDiv);

    const playerOne = document.createElement("div");
    playerOne.classList.add("playerOne");
    playerOne.setAttribute("id", "playerOne");
    playerOne.innerText = "Player One: " + GamePlay.score.playerOne;
    scoreDiv.appendChild(playerOne);

    const playerTwo = document.createElement("div");
    playerTwo.classList.add("playerTwo");
    playerTwo.setAttribute("id", "playerTwo");
    playerTwo.innerText = "Player Two: " + GamePlay.score.playerTwo;
    scoreDiv.appendChild(playerTwo);
  },
};

const GamePlay = {
  gameboard: [],
  playerTurn: true,
  score: { playerOne: 0, playerTwo: 0 },

  evenListener() {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => {
      block.addEventListener("click", (e) => {
        if (e.target.classList.value !== "") return;

        const blockId = e.target.id;
        const blockIdNum = blockId.split("_")[1];
        const block = document.getElementById(`block_${blockIdNum}`);
        this.playerTurn
          ? block.classList.add("clickedPlayer-1")
          : block.classList.add("clickedPlayer-2");
        this.gameboard[blockIdNum] = this.playerTurn == true ? 1 : 2;

        this.checkWin();
      });
    });
  },

  checkWin() {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let player = this.playerTurn ? 1 : 2;

    for (let combo = 0; combo < winCombos.length; combo++) {
      let [a, b, c] = [
        this.gameboard[winCombos[combo][0]],
        this.gameboard[winCombos[combo][1]],
        this.gameboard[winCombos[combo][2]],
      ];

      for (let cIndex = 0; cIndex < winCombos[combo].length; cIndex++) {
        if (this.gameboard[winCombos[combo][cIndex]] !== player) break;

        if (a != player || b != player || c != player) break;

        this.incrementScore();
        this.determineWinner();
        this.resetGame();

        return;
      }
    }
    this.checkIfTie();
    this.toggleTurn();
  },

  toggleTurn() {
    this.playerTurn = !this.playerTurn;
  },

  incrementScore() {
    this.playerTurn ? this.score.playerOne++ : this.score.playerTwo++;
    if (this.playerTurn == true)
      document.getElementById("playerOne").innerText =
        "Player One: " + this.score.playerOne;
    else
      document.getElementById("playerTwo").innerText =
        "Player Two: " + this.score.playerTwo;
  },

  checkIfTie() {
    for (let index = 0; index < 9; index++) {
      console.log(this.gameboard);
      if (typeof this.gameboard[index] == "undefined") return;
    }

    alert("It's a tie!");
    this.resetGame();
  },

  determineWinner() {
    if (this.playerTurn) alert("Player One Wins!");
    else alert("Player Two Wins!");
  },

  resetGame() {
    const blocks = document.querySelectorAll(".block");

    blocks.forEach((block) => {
      const child = block.firstElementChild;

      child.classList.remove("clickedPlayer-1");
      child.classList.remove("clickedPlayer-2");
    });
    this.gameboard = [];
  },
};

const ai = {
  playerTwoAi() {
    const blocks = document.querySelectorAll(".block");
    const blockIds = [];
    blocks.forEach((block) => {
      const child = block.firstElementChild;
      if (child.classList.value == "") blockIds.push(block.id);
    });

    const randomBlockId = blockIds[Math.floor(Math.random() * blockIds.length)];
    const block = document.getElementById(`block_${randomBlockId}`);
    block.classList.add("clickedPlayer-2");
    this.gameboard[randomBlockId] = 2;
    this.checkWin();
  },
};

GameBoard.render();

var Players = {
  player1: true,
  player2: false,
};
