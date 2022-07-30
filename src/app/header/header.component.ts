import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() headerMsg: string;

  constructor() {
    this.headerMsg = "";
  }

}
