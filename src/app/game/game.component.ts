import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @Input() isComputerPlayer: boolean;
  @Output() mainMenuEmitter = new EventEmitter();

  headerMsg: string;

  constructor() {
    this.headerMsg = "Player 1's turn. Click any square to start.";
    this.isComputerPlayer = false;
  }

  setHeaderMsg(msg: Event) {
    this.headerMsg = String(msg);
  }

  handleMainMenu() {
    this.mainMenuEmitter.emit();
  }
}