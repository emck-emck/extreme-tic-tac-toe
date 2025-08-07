/**
* The main controller for the gameplay itself.
*/
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { GameCommObj } from '../game-comm-obj.interface';
import { ComputerService } from '../computer/computer.service';
@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent {
  // This variable defines what "three in a row" looks like in terms of a one-dimensional array
  private winConditions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // This variable is a memory holder for the board state so that win conditions can be checked.
  boardState: number[][];
  tttWins: number[];

  gameTurn: number;
  activeBoard: number;

  @Input() computerPlayer: number;
  @Output() headerMsg = new EventEmitter();

  tttBoardsInit: number[];

  computer: ComputerService;

  /**
   * CONSTRUCTOR
   * Board initialization goes here
   */
  constructor() {
    this.gameTurn = 0;
    this.tttBoardsInit = [0, 1, 2];
    this.activeBoard = -1;

    // Initialize board state
    this.boardState = new Array(9);
    this.tttWins = new Array(9);
    for (var i: number = 0; i < 9; i++) {
      this.boardState[i] = new Array(9);
      this.tttWins[i] = 0;
      for (var j: number = 0; j < 9; j++) {
        this.boardState[i][j] = 0;
      }
    }

    // Initialize Computer
    this.computer = new ComputerService(computerPlayer);
  }

  /**
   * Main action listener function
   * Pretty much the entry point to any code run in this component
   */
  handleSquareClick(ids: Event) {
    var obj: GameCommObj = JSON.parse(String(ids));
    var headerMsg: string;
    var stateFlag: number = 1;

    stateFlag = this.saveBoardChange(obj, stateFlag);
    if(stateFlag != 4){ // If state is 4, game is won.
      stateFlag = this.changeActiveBoard(obj['sid'], stateFlag);
    }

    this.gameTurn++;
    headerMsg = this.getHeaderMessage(obj['pid'], stateFlag);
    this.headerMsg.emit(headerMsg);

    if (stateFlag == 4) {
      this.handleEndGame();
    } else {
      this.handleComputerPlay();
    }
  }

  /**
   * SAVEBOARDCHANGE() and associated functions
   */
  // Save square clicked to boardState object and check for board win condition
  // Returns a flag for board state
  saveBoardChange(obj: GameCommObj, stateFlag: number): number {
    var flag: number = stateFlag; // Flag one is a regular state
    var isBoardWin: boolean;
    this.boardState[obj['qid']][obj['sid']] = obj['pid'];
    isBoardWin = this.checkTTTWinCondition(obj['qid'], obj['pid']);
    if (isBoardWin) {
      // Flag 2 means a board was won
      flag = 2;
      // change CSS on given TTT to reflect player win
      // Save board win in memory
      this.tttWins[obj['qid']] = obj['pid'];
      // check for game win
      var isGameWin: boolean = this.checkGameWinCondition(obj['pid']);
      if (isGameWin) {
        flag = 4; // Flag 4 means a player won the game
      }
    }else{
      // Check for cat's game and save it
      if(this.checkCatsGame(obj['qid'])){
        this.tttWins[obj['qid']] = -1;
      }
    }
    return flag;
  }
 
  // Checks to see if one of the quadrants was won with the last move.
  checkTTTWinCondition(qid: number, p: number): boolean {
    var isWin: boolean = false;;
 
    // If the board was already won, return false; it can't be re-won.
    if (this.tttWins[qid] != 0) {
      return false;
    }
    // For each possible win condition:
    for (var i: number = 0; i < this.winConditions.length; i++) {
      isWin = true;
      // We check if the win condition was met
      for (var j: number = 0; j < this.winConditions[i].length; j++) {
        // This boolean in other words means:
        // does the concerned quadrant have our player's token in a win condition spot
        if (!(this.boardState[qid][this.winConditions[i][j]] == p)) {
          // If they don't, it's not a win.
          isWin = false;
        }
      }
      // If a win condition is met then it's a win
      if (isWin) {
        return true;
      }
    }
    return isWin;
  }

  // Same logic as checkTTTWinCondition, just for the big board instead of the little one
  checkGameWinCondition(p: number) {
    var isWin: boolean = false;
    // For each win condition:
    for (var i: number = 0; i < this.winConditions.length; i++) {
      isWin = true;
      // Check if win condition is met
      for (var j: number = 0; j < this.winConditions[i].length; j++) {
        // Translation:
        // does the player have a win on a specific board
        if (!(this.tttWins[this.winConditions[i][j]] == p)) {
          isWin = false;
        }
      }
      if (isWin) {
        break;
      }
    }
    return isWin;
  }

  // Checks for a cat's game in any given quadrant
  checkCatsGame(quadrant: number){
    // Check if any squares are empty
    // (We verified in saveBoardChange that it wasn't a win)
    for(var i: number = 0; i < this.boardState[quadrant].length; i++){
      if(this.boardState[quadrant][i] == 0){
        return false; // not a cat's game if there's still a square
      }
    }
    return true; 
  }

  /**
   * CHANGEACTIVEBOARD() and associated functions
   */
  // This method changes the active TTT board to the one corresponding to where the user clicked on the previously active one.
  // checkHungBoard() handles the selection logic.
  changeActiveBoard(squareClicked: number, stateFlag: number): number {
    var flag: number = stateFlag;

    // If someone already won this board, the player may play in any valid board
    if(this.tttWins[squareClicked] != 0){
      this.activeBoard = -1;
      flag = 3;
    }else{
      this.activeBoard = squareClicked;
    }

    return flag;
  }

  /**
   * GETHEADERMESSAGE() and associated functions
   */
  getHeaderMessage(lastPlayer: number, flag: number): string {
    var msg: string;
    if (flag == 1) {
      // Flag 1 means the player made a move.
      if (lastPlayer == 1) {
        msg = "Player 2's turn";
      } else {
        msg = "Player 1's turn";
      }
    } else if (flag == 2) {
      // Flag 2 means a player won a board
      if (lastPlayer == 1) {
        msg = "Board won by Player 1. Player 2's turn";
      } else {
        msg = "Board won by Player 2. Player 1's turn";
      }
    } else if (flag == 3) {
      // Flag 3 means a hung board was encountered
      if (lastPlayer == 1) {
        msg = "Board hung, new board selected. Player 2's turn";
      } else {
        msg = "Board hung, new board selected. Player 1's turn";
      }
    } else if (flag == 4) {
      // Flag 4 means the game is over and someone won
      if (lastPlayer == 1) {
        msg = 'Game over, Player 1 wins!';
      } else {
        msg = 'Game over, Player 2 wins!';
      }
    } else if (flag == 5) {
      msg = "Game board is full, it's a cat's game";
    } else {
      msg = 'Something went wrong';
    }
    return msg;
  }

  /**
   * HANDLEENDGAME() and associated functions
   */
  handleEndGame() {
    this.activeBoard = 9;
  }

  /**
   * HANDLECOMPUTERPLAY and associated functions
   */
  handleComputerPlay() {
    var cObj: GameCommObj = JSON.parse('{}');
    var cMove: number;
    var cBoard: number;
    var headerMsg: string;
    var stateFlag: number = 1;

    if(this.activeBoard == -1){
      cBoard = this.computer.computerSelectBoard(this.tttWins);
      cMove = this.computer.computerMove(this.boardState[cBoard]);
      this.activeBoard = cBoard;
    }else{
      cMove = this.computer.computerMove(this.boardState[this.activeBoard]);
    }

    // Manually create computer JSON
    cObj['sid'] = cMove;
    cObj['qid'] = this.activeBoard;
    cObj['pid'] = 2;

    stateFlag = this.saveBoardChange(cObj, stateFlag);
    stateFlag = this.changeActiveBoard(cMove, stateFlag);

    this.gameTurn++;
    headerMsg = this.getHeaderMessage(cObj['pid'], stateFlag);
    this.headerMsg.emit(headerMsg);

    if (stateFlag == 4) {
      this.handleEndGame();
    }
  }
}
