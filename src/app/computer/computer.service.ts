import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor() { }

  public computerSelectBoard(boardState: number[]): number{
    var select: number[] = [];
    var rando: number;
    for(var i: number = 0; i < boardState.length; i++){
      if(boardState[i] == 0){
        select.push(i);
      }
    }
    rando = Math.floor(Math.random() * select.length)
    return select[rando];
  }

  public computerMove(ttt: number[]): number {
    var rando: number;
    // We have made sure that there's a square for the computer to play in
    while (true) {
      rando = Math.floor(Math.random() * 9);
      if (ttt[rando] == 0) {
        return rando;
      }
    }
  }
}
