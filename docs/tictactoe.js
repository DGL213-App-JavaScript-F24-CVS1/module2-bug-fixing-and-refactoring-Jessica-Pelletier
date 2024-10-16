"use strict";

(() => {
  window.addEventListener("load", (event) => {
    // *****************************************************************************
    // #region Constants and Variables

    // Canvas references
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // UI references
    const restartButton = document.querySelector("#restart");
    const undoButton = document.querySelector("#undo");


    // Constants
    const CELL_COLORS = {
      white: [255, 255, 255],
      black: [0, 0, 0],
      red: [255, 0, 0],
      green: [0, 255, 0],
      blue: [0, 0, 255],
    };

    /* Set the players colors */
const PLAYER_COLORS ={
  player1: CELL_COLORS.blue,
  player2: CELL_COLORS.green
};

/*Game starts with the first player*/
let currentPlayer = 'player1'; 


    const CELLS_PER_AXIS = 3;
    const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
    const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;


    // Game objects
    let grids;

    // #endregion

    // *****************************************************************************
    // #region Game Logic

    function startGame(startingGrid = []) {
      if (startingGrid.length === 0) {
        startingGrid = initializeGrid();
      }
      initializeHistory(startingGrid);
      render(grids[0]);
    
    }

    function initializeGrid() {
      const newGrid = [];
      for (let i = 0; i < CELLS_PER_AXIS * CELLS_PER_AXIS; i++) {
        newGrid.push(CELL_COLORS.white);
      }
      return newGrid;
    }

    function initializeHistory(startingGrid) {
      grids = [];
      grids.push(startingGrid);
    }

    function rollBackHistory() {
      if (grids.length > 0) {
        grids = grids.slice(0, grids.length - 1);
        render(grids[grids.length - 1]);
      }
    }



    function render(grid) {
      for (let i = 0; i < grid.length; i++) {
        ctx.fillStyle = `rgb(${grid[i][0]}, ${grid[i][1]}, ${grid[i][2]})`;
        ctx.fillRect(
          (i % CELLS_PER_AXIS) * CELL_WIDTH,
          Math.floor(i / CELLS_PER_AXIS) * CELL_HEIGHT,
          CELL_WIDTH,
          CELL_HEIGHT
         
        );
        
      }

      //USED CHAT GPT
      // Draw the black grid lines
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2; 
      for (let i = 0; i <= CELLS_PER_AXIS; i++) {
        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_WIDTH, 0);
        ctx.lineTo(i * CELL_WIDTH, canvas.height);
        ctx.stroke();

        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_HEIGHT);
        ctx.lineTo(canvas.width, i * CELL_HEIGHT);
        ctx.stroke();
      }

   
    }

    function updateGridAt(mousePositionX, mousePositionY) {
      const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY );
      const newGrid = grids[grids.length - 1].slice();

      //Push current players color to grid array
      newGrid[gridCoordinates.row * CELLS_PER_AXIS + gridCoordinates.column] = PLAYER_COLORS[currentPlayer];
      grids.push(newGrid);
      render(grids[grids.length - 1]);

   
      
    }

    let playerIndicator = document.querySelector(".player");

    // Figure out whos turn it us, change to next player for their turn
    function playersTurn(){
      if (currentPlayer === 'player1') {
        playerIndicator.textContent = "Player One's Turn";
        playerIndicator.style.color = 'blue';
      } else {
        playerIndicator.textContent = "Player Two's Turn" ;
        playerIndicator.style.color = 'green';
      }

    }






    
    function restart() {
      startGame(grids[0]);
    }

    // #endregion

    // *****************************************************************************
    // #region Event Listeners

    canvas.addEventListener("mousedown", gridClickHandler);
    function gridClickHandler(event) {
      updateGridAt(event.offsetX, event.offsetY);
      currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1' ;

      playersTurn();
        }

    restartButton.addEventListener("mousedown", restartClickHandler);
    function restartClickHandler() {
      restart();
    }

    undoButton.addEventListener("mousedown", undoLastMove);
    function undoLastMove() {
      rollBackHistory();
    }

    // #endregion

    // *****************************************************************************
    // #region Helper Functions

    // To convert canvas coordinates to grid coordinates
    function convertCartesiansToGrid(xPos, yPos) {
      return {
        column: Math.floor(xPos / CELL_WIDTH),
        row: Math.floor(yPos / CELL_HEIGHT),
      };
    }




    // #endregion

    //Start game
    startGame();
    playersTurn();
  });
})();
