import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Menu } from './menu/menu.component';
import { Game } from './game/game.component';
import { Instructions } from './instructions/instructions.component';
import { Board } from './board/board.component';
import { Header } from './header/header.component';
import { Footer } from './footer/footer.component';
import { TTT } from './ttt/ttt.component';
import { Square } from './square/square.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    Menu,
    Game,
    Instructions,
    Board,
    Header,
    Footer,
    TTT,
    Square,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
