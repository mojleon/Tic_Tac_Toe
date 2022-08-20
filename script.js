const GameBoard = {
  render: () => {
    const body = document.querySelector("body");
    const gameboardDiv = document.createElement("div");
    gameboardDiv.classList.add("gameboardDiv");
    body.appendChild(gameboardDiv);

    for (let divIndex = 0; divIndex < 9; divIndex++) {
      GameBoard.placeBlock(gameboardDiv, divIndex);
    }

    GameBoard.placeScoreBoard(gameboardDiv);
    GameBoard.placeDifficulty(body);
    GameBoard.threeD();
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

  placeScoreBoard(body) {
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

  placeDifficulty(body) {
    const difficultyDiv = document.createElement("select");

    const difficultyLevels = ["Easy", "Impossible"];

    difficultyDiv.setAttribute("id", "difficulty");
    difficultyDiv.classList.add("difficulty");

    for (let i = 0; i < difficultyLevels.length; i++) {
      {
        const option = document.createElement("option");
        option.setAttribute("value", difficultyLevels[i]);
        option.innerText = difficultyLevels[i];
        difficultyDiv.appendChild(option);
      }

      body.appendChild(difficultyDiv);
    }
  },

  threeD() {
    let constrain = 20;
    let gameboardDiv = document.querySelector(".gameboardDiv");

    function transforms(x, y, el) {
      let box = el.getBoundingClientRect();
      let calcX = -(y - box.y - box.height / 2) / constrain;
      let calcY = (x - box.x - box.width / 2) / constrain;

      return (
        "perspective(200px) " +
        "   rotateX(" +
        calcX +
        "deg) " +
        "   rotateY(" +
        calcY +
        "deg) "
      );
    }

    function transformElement(el, xyEl) {
      el.style.transform = transforms.apply(null, xyEl);
    }

    gameboardDiv.onmousemove = function (e) {
      let xy = [e.clientX, e.clientY];
      let position = xy.concat([gameboardDiv]);

      window.requestAnimationFrame(function () {
        transformElement(gameboardDiv, position);
      });
    };
  },
};

const GamePlay = {
  gameboard: [],
  playerTurn: true,
  score: { playerOne: 0, playerTwo: 0 },
  winCombos: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],

  evenListener() {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => {
      block.addEventListener("click", (e) => {
        if (e.target.classList.value !== "") return;

        this.clickBlock(e.target);
      });
    });
  },

  clickBlock(target) {
    console.log(target.id);
    const blockId = target.id;
    const blockIdNum = blockId.split("_")[1];
    const block = document.getElementById(`block_${blockIdNum}`);
    this.playerTurn
      ? block.classList.add("clickedPlayer-1")
      : block.classList.add("clickedPlayer-2");
    this.gameboard[blockIdNum] = this.playerTurn == true ? 1 : 2;

    this.checkWin();
  },

  checkWin() {
    let player = this.playerTurn ? 1 : 2;

    for (let combo = 0; combo < this.winCombos.length; combo++) {
      let [a, b, c] = [
        this.gameboard[this.winCombos[combo][0]],
        this.gameboard[this.winCombos[combo][1]],
        this.gameboard[this.winCombos[combo][2]],
      ];

      for (let cIndex = 0; cIndex < this.winCombos[combo].length; cIndex++) {
        if (this.gameboard[this.winCombos[combo][cIndex]] !== player) break;

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
    if (this.playerTurn) {
      this.playerTurn = false;
      AI.checkDifficulty();
    }
    this.playerTurn = true;
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

const AI = {
  checkDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty == "Easy") {
      this.easyAi();
    } else if (difficulty == "Impossible") {
      this.hardAi();
    }
  },
  easyAi() {
    const blocks = document.querySelectorAll(".block");
    const blockIds = [];

    blocks.forEach((block) => {
      const child = block.firstElementChild;
      if (child.classList.value == "") blockIds.push(child.id.split("_")[1]);
    });

    const randomBlockId = blockIds[Math.floor(Math.random() * blockIds.length)];
    const block = document.getElementById(`block_${randomBlockId}`);
    GamePlay.clickBlock(block);
  },
  hardAi() {
    const blocks = document.querySelectorAll(".block");
    const blockIds = [];

    blocks.forEach((block) => {
      const child = block.firstElementChild;
      if (child.classList.value == "")
        blockIds.push([child.id.split("_")[1], child.classList.value]);
    });

    let blockId = blockIds[Math.floor(Math.random() * blockIds.length)][0];

    GamePlay.winCombos.forEach((combo) => {
      const [a, b, c] = combo;
      const gameboard = GamePlay.gameboard;
      if (
        (gameboard[a] == 2 &&
          gameboard[b] == 2 &&
          typeof gameboard[c] == "undefined") ||
        (gameboard[a] == 1 &&
          gameboard[b] == 1 &&
          typeof gameboard[c] == "undefined")
      )
        blockId = c;
      if (
        (gameboard[a] == 2 &&
          typeof gameboard[b] == "undefined" &&
          gameboard[c] == 2) ||
        (gameboard[a] == 1 &&
          typeof gameboard[b] == "undefined" &&
          gameboard[c] == 1)
      )
        blockId = b;
      if (
        (typeof gameboard[a] == "undefined" &&
          gameboard[b] == 2 &&
          gameboard[c] == 2) ||
        (typeof gameboard[a] == "undefined" &&
          gameboard[b] == 1 &&
          gameboard[c] == 1)
      )
        blockId = a;
    });

    const block = document.getElementById(`block_${blockId}`);

    GamePlay.clickBlock(block);
  },
};

GameBoard.render();
