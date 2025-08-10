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
      return this.computerMove(boardState[playedBoard], playedBoard);
	}else if(this.difficulty == 2){
      var playedBoard: number;
      
      playedBoard = this.l2cw(qWins, 2); // Check for 2 in a row wins and play for third if found
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], playedBoard);
      }
      playedBoard = this.l2cw(qWins, 1); // Check for 2 in a row losses and play for block if found
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], playedBoard);
      }
      playedBoard = this.l2as(qWins); // Play an advantageous square
      if(playedBoard != -1){
        return this.computerMove(boardState[playedBoard], playedBoard);
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
  public computerMove(q: number[], playedQ: number): GameCommObj {
    var pcMove: GameCommObj = JSON.parse("{}");

    pcMove['qid'] = playedQ;

    var ans: number;
	if(this.difficulty == 1){ // Level one plays random squares
      var vSquares: number[] = this.findValidSquares(q);
      var rando: number = Math.floor(Math.random() * vSquares.length);
      pcMove['sid'] = vSquares[rando];
	}else if(this.difficulty == 2){
      var s: number;
	  // Check for immediate wins
	  s = this.l2cw(q, 2);
	  if(s != -1){
        pcMove['sid'] = s;
      }

	  // Check for immediate losses
	  s = this.l2cw(q, 1);
	  if(s != -1){
        pcMove['sid'] = s;
      }

	  // Play advantageous square if none of the above found
      s = this.l2as(q);
      if(s != -1){
        pcMove['sid'] = s;
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

    return pcMove
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

}
