import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class Game {
  @Input() computerPlayer: number;
  @Output() mainMenuEmitter = new EventEmitter();

  headerMsg: string;

  constructor() {
    this.headerMsg = "Player 1's turn. Click any square to start.";
  }

  setHeaderMsg(msg: Event) {
    this.headerMsg = String(msg);
  }

  handleMainMenu() {
    this.mainMenuEmitter.emit();
  }
}
