import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class Footer {
  @Output() mainMenuEmitter = new EventEmitter();

  constructor() {}

  handleMainMenu() {
    this.mainMenuEmitter.emit();
  }
}
