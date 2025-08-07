import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @Output() playGameEmitter = new EventEmitter();
  @Output() showInstructionsEmitter = new EventEmitter();

  mainMenu: boolean;
  constructor(){
	this.mainMenu = true;
  }

  handlePlayGame(i: number) {
	this.playGameEmitter.emit(i);
  }

  handleMenuSwitch(){
	this.mainMenu = !this.mainMenu;
  }

  handleShowInstructions() {
	this.showInstructionsEmitter.emit();
  }
}