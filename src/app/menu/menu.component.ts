import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class Menu {
	@Output() playGameEmitter = new EventEmitter();
	@Output() showInstructionsEmitter = new EventEmitter();

	cpu: boolean;

	constructor(){
		this.cpu = false;
	}

	handlePlayGame(i: number) {
		this.playGameEmitter.emit(i);
	}

	handleSelectDifficulty(){
		this.cpu = !this.cpu;
	}

	handleShowInstructions() {
		this.showInstructionsEmitter.emit();
	}
}
