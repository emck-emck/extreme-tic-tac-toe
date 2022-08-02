import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor() { }

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
