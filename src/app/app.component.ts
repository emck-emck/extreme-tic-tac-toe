/**
 * This is the master component, all roads lead to here.
 * There is a menu, instructions, and a game board and ther are switched between from here.
 */
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  computerPlayer: number;

  activeView: number; // 0 is menu, 1 is game, 2 is instructions
  constructor() {
    this.activeView = 0;
  }

  handleMainMenu() {
    this.activeView = 0;
  }

  handleMenuPlayGame(e: Event) {
    this.activeView = 1;
    this.computerPlayer = Number(e);
  }

  handleShowInstructions() {
    this.activeView = 2;
  }
}
