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

var GamePlay = {
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
        GamePlay.playerTurn
          ? block.classList.add("clickedPlayer-1")
          : block.classList.add("clickedPlayer-2");
        GamePlay.gameboard[blockIdNum] = GamePlay.playerTurn == true ? 1 : 2;

        GamePlay.checkWin();
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

    let player = GamePlay.playerTurn ? 1 : 2;
    console.log(GamePlay.playerTurn);

    for (let combo = 0; combo < winCombos.length; combo++) {
      let [a, b, c] = [
        GamePlay.gameboard[winCombos[combo][0]],
        GamePlay.gameboard[winCombos[combo][1]],
        GamePlay.gameboard[winCombos[combo][2]],
      ];

      for (let cIndex = 0; cIndex < winCombos[combo].length; cIndex++) {
        if (GamePlay.gameboard[winCombos[combo][cIndex]] !== player) break;

        if (a != player || b != player || c != player) break;

        GamePlay.incrementScore();
        GamePlay.determineWinner();
        GamePlay.resetGame();

        return;
      }
    }
    GamePlay.checkIfTie();
    GamePlay.toggleTurn();
  },

  toggleTurn() {
    GamePlay.playerTurn = !GamePlay.playerTurn;
  },

  incrementScore() {
    GamePlay.playerTurn
      ? GamePlay.score.playerOne++
      : GamePlay.score.playerTwo++;
    if (GamePlay.playerTurn == true)
      document.getElementById("playerOne").innerText =
        "Player One: " + GamePlay.score.playerOne;
    else
      document.getElementById("playerTwo").innerText =
        "Player Two: " + GamePlay.score.playerTwo;
  },

  checkIfTie() {
    for (let index = 0; index < 9; index++) {
      console.log(GamePlay.gameboard);
      if (typeof GamePlay.gameboard[index] == "undefined") return;
    }

    alert("It's a tie!");
    GamePlay.resetGame();
  },

  determineWinner() {
    if (GamePlay.playerTurn) alert("Player One Wins!");
    else alert("Player Two Wins!");
  },

  resetGame() {
    const blocks = document.querySelectorAll(".block");

    blocks.forEach((block) => {
      const child = block.firstElementChild;

      child.classList.remove("clickedPlayer-1");
      child.classList.remove("clickedPlayer-2");
    });
    GamePlay.gameboard = [];
  },
};

GameBoard.render();

var Players = {
  player1: true,
  player2: false,
};
