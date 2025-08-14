import { Injectable } from '@angular/core';
import { GameCommObj } from '../game-comm-obj.interface';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  difficulty: number;

  
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
  // Squares listed in order of how inherently good they are
  private priority: number[][] = [[4], [0, 2, 6, 8], [1, 3, 5, 7]]; 

  constructor() {
    this.difficulty = -1;
  }

  // Handles computer logic for when the computer can play in any board
  public computerMoveBoard(qWins: number[], boardState: number[][]): GameCommObj{
    if(this.difficulty == 1){ // Select a random valid board
      var vBoards: number[] = this.findValidSquares(qWins);
      var rando: number = Math.floor(Math.random() * vBoards.length);
      var playedBoard: number = vBoards[rando];
      return this.computerMove(boardState[playedBoard], qWins, playedBoard);
	}else if(this.difficulty == 2 || this.difficulty == 3){
      var playedBoard: number;

      // Level 3 Board Move Logic Hook
      if(this.difficulty == 3){
        var boardScan: GameCommObj;
        // Check for an immediate win/loss in all valid boards
        // Prioritize boards with win condition
        boardScan = this.l3ScanBoards(qWins, boardState);
        if(boardScan['sid'] != -1){
          return boardScan;
        }
      }
      
      playedBoard = this.l2cw(qWins, 2); // Check for 2 in a row wins and play for third if found
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], qWins, playedBoard);
      }
      playedBoard = this.l2cw(qWins, 1); // Check for 2 in a row losses and play for block if found
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], qWins, playedBoard);
      }
      playedBoard = this.l2as(qWins); // Play an advantageous square
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], qWins, playedBoard);
      }else{// This is an error condition
        var obj: GameCommObj = JSON.parse('{}');
        obj['qid'] = -1;
        obj['sid'] = -1;
        return obj;
      }
	}else{ // This is an error condition
      var obj: GameCommObj = JSON.parse('{}');
      obj['qid'] = -1;
      obj['sid'] = -1;
      return obj;
    }
  }


  // We have made sure that there's a square for the computer to play in
  public computerMove(q: number[], qWins: number[], playedQ: number): GameCommObj {
    var pcMove: GameCommObj = JSON.parse("{}");

    pcMove['qid'] = playedQ;

	if(this.difficulty == 1){ // Level one plays random squares
      var vSquares: number[] = this.findValidSquares(q);
      var rando: number = Math.floor(Math.random() * vSquares.length);
      pcMove['sid'] = vSquares[rando];
      return pcMove;
	}else if(this.difficulty == 2){
      var s: number;
	  // Check for immediate wins
	  s = this.l2cw(q, 2);
	  if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }

	  // Check for immediate losses
	  s = this.l2cw(q, 1);
	  if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }

	  // Play advantageous square if none of the above found
      s = this.l2as(q);
      if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }else{ // This is an error condition
        var obj: GameCommObj = JSON.parse('{}');
        obj['qid'] = -1;
        obj['sid'] = -1;
        return obj;
      }
	}else if(this.difficulty == 3){
      var s: number;
      var vSquares: number[];

      // Do not send opponent to hung board if possible
      vSquares = this.findValidSquares(qWins);

	  // Check for immediate wins
	  s = this.l3cw(q, vSquares, 2);
	  if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }

	  // Check for immediate losses
	  s = this.l3cw(q, vSquares, 1);
	  if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }

	  // Play advantageous square if no immediate wins found
      s = this.l3as(q, vSquares);
      if(s != -1){
        pcMove['sid'] = s;
        return pcMove;
      }else{ // This is an error condition
        var obj: GameCommObj = JSON.parse('{}');
        obj['qid'] = -1;
        obj['sid'] = -1;
        return obj;
      }
    }else{ // This is an error condition
      var obj: GameCommObj = JSON.parse('{}');
      obj['qid'] = -1;
      obj['sid'] = -1;
      return obj;
    }
  }


  /**
   * LEVEL 1 HELPER FUNCTIONS
   */
  // Helper function for finding squares that haven't been played in or qs that haven't been won
  private findValidSquares(board: number[]): number[]{
    var vSquares: number[] = [];
    for(var i: number = 0; i < board.length; i++){
      if(board[i] == 0){
        vSquares.push(i);
      }
    }
    return vSquares;
  }

  /**
   * LEVEL 2 HELPER FUNCTIONS
   */
  // Level 2 Check Wins (/Losses)
  private l2cw(q: number[], p: number): number{
	for (var i: number = 0; i < this.winConditions.length; i++) { // For each potential win condition:
	  var r: number = 0; // How many in a row have we found for this win condition?
      for(var j: number = 0; j < this.winConditions[i].length; j++){
		if(q[this.winConditions[i][j]] == p){ // Is there a player X or O in this win condition square?
		  r = r + 1;
		}
	  }
  	  if(r == 2){ // If there's two in a row within a win condition
		// Find the third square
		for(var j: number = 0; j < this.winConditions[i].length; j++){
		  if(q[this.winConditions[i][j]] == 0){ // Is the third square blank?
			return this.winConditions[i][j]; // Fill in this third square
		  }
		}
	  }
	}
	return -1;
  }

  // Level 2 Advantageous Square
  private l2as(board: number[]): number{
	var rando: number;
	
	for(var i: number = 0; i < this.priority.length; i++){ //For each priority level
	  var temp: number[] = [];
	  for(var j: number = 0; j < this.priority[i].length; j++){ 
		if(board[this.priority[i][j]] == 0){
		  temp.push(this.priority[i][j]); // Push every free square of that priority level into a temp array
		}
	  }
	  if(temp.length > 0){
	    rando = Math.floor(Math.random()*temp.length); // Pick a random free square
		return temp[rando];
	  }
	}
	return -1;
  }

  /**
   * LEVEL 3 HELPER FUNCTIONS
   */

  // Level 3 Scan Boards
  // Tries to find an immediate win on any valid board
  private l3ScanBoards(qWins: number[], boardState: number[][]): GameCommObj{
    var ret: GameCommObj = JSON.parse('{}');
    var rPrio: number[][];
    var winningMoves: number[][] = [];

    var move: number[];
    var q: number[];
    var qNum: number;
    var sNum: number;
    var isWin: boolean;

    // Get priority list of quadrants to check
    rPrio = this.l3PriorityShuffle(qWins);

    // For each valid board
    for(var i: number = 0; i < rPrio.length; i++){
      for(var j: number = 0; j < rPrio[i].length; j++){
        move = [];
        q = boardState[rPrio[i][j]];
        qNum = rPrio[i][j];
        // Check if win
        sNum = this.l2cw(q, 2);

        // If win, save to winningMoves
        if(sNum != -1){
          // Prioritize moves that will win the game
          move.push(qNum);
          move.push(sNum);
          isWin = this.l3IsWin(qNum, qWins, 2);
          if(isWin){
            winningMoves.splice(0, 0, move);
          }else{
            winningMoves.push(move);
          }
        }
      }
    }

    if(winningMoves.length > 0){
      // Return GameCommObj if win found
      ret['qid'] = winningMoves[0][0];
      ret['sid'] = winningMoves[0][1];
      return ret;
    }else{
      // Return invalid GameCommObj if no win found
      ret['qid'] = -1;
      ret['sid'] = -1;
      return ret;
    }
  }

  // Level 3 Check Wins (/Losses)
  private l3cw(q: number[], vQ: number[], p: number): number{
	for (var i: number = 0; i < this.winConditions.length; i++) { // For each potential win condition:
	  var r: number = 0; // How many in a row have we found for this win condition?
      for(var j: number = 0; j < this.winConditions[i].length; j++){
		if(q[this.winConditions[i][j]] == p){ // Is there a player X or O in this win condition square?
		  r = r + 1;
		}
	  }
  	  if(r == 2){ // If there's two in a row within a win condition
		// Find the third square
		for(var j: number = 0; j < this.winConditions[i].length; j++){
		  if(q[this.winConditions[i][j]] == 0){ // Is the third square blank?
            if(vQ.includes(this.winConditions[i][j])){ // If this won't send the opponent to a hung board
              return this.winConditions[i][j]; // Fill in this third square
            }else{
              if(p == 2){ // Fill in the third square if it's a win for the PC
                return this.winConditions[i][j];
              }
              // Keep checking if it's only a block
            }
		  }
		}
	  }
	}
	return -1;
  }

  // Level 3 Advantageous Square
  private l3as(board: number[], vQ: number[]): number{
	var rando: number;
	var rando2: number;
    var n: number;
    var rPrio: number[][];


    // Generate slightly randomized priority list
    rPrio = this.l3PriorityShuffle(board);
	
    // Try to send the opponent to an unhung board
	for(var i: number = 0; i < rPrio.length; i++){ //For each priority level in rPrio
	  for(var j: number = 0; j < rPrio[i].length; j++){ 
        if(vQ.includes(rPrio[i][j])){ // Unhung check
          return rPrio[i][j];
        }
	  }
	}
    // If the PC has no choice but to send the opponent to a hung board
    // Pick a random valid square
    for(n = 0; n < rPrio.length; n++){
      if(rPrio[n].length == 0){
        n = n + 1;
        break;
      }
    }
    rando = Math.floor(Math.random() * n);
    rando2 = Math.floor(Math.random() * rPrio[rando].length);
    return rPrio[rando][rando2]
  }

  // Level 3 Priority Shuffle
  // Returns the priority array slightly randomized, excluding occupied boards
  private l3PriorityShuffle(board: number[]): number[][]{
    var rPrio: number[][] = [[],[],[]];

    for(var i: number = 0; i < this.priority.length; i++){ //For each priority level
	  var temp: number[] = [];
	  for(var j: number = 0; j < this.priority[i].length; j++){ 
		if(board[this.priority[i][j]] == 0){
		  temp.push(this.priority[i][j]); // Push every free square of that priority level into a temp array
		}
	  }
	  if(temp.length > 1){
        // Shuffle temp array
        temp = this.shuffleArray(temp);
	  }
      rPrio[i] = temp; // Save temp data to rPrio
	}
    return rPrio;
  }

  private l3IsWin(move: number, board: number[], player: number): boolean{
    var winsToCheck: number[][];
    var isWin: boolean;

    // Filter win conditions to relevant ones
    winsToCheck = this.winConditions.filter(a => a.includes(move));

    // For each win condition we care about
    for(var i: number = 0; i < winsToCheck.length; i++){
      isWin = true;
      for(var j: number = 0; j < winsToCheck[i].length; j++){
        // Is the square occupied by the opponent?
        if(!(board[winsToCheck[i][j]] == 0 || board[winsToCheck[i][j]] == player)){
          // It's not valid, set fail flag and move on
          isWin = false;
          break;
        }
      }
      if(isWin){
        return true;
      }
    }

    // If we didn't find a win by this point, the move is not a win
    return false;
  }
  
   /**
   * MISC HELPER FUNCTIONS
   */
  // Fisher-Yates Shuffle Algorithm (generated by AI)
  private shuffleArray(array: number[]): number[]{
    // Iterate from the last element down to the second element
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index 'j' from 0 up to the current 'i' (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices 'i' and 'j'
      // This can be done using array destructuring for a concise swap
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
