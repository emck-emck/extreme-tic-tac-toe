import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'game-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  @Output() mainMenuEmitter = new EventEmitter();

  constructor() {}

  handleMainMenu() {
    this.mainMenuEmitter.emit();
  }
}