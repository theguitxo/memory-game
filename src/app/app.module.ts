import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { HeaderComponent } from './components/header/header.component';
import { LevelSelectorComponent } from './components/level-selector/level-selector.component';
import { GameButtonsComponent } from './components/game-buttons/game-buttons.component';
import { GameCronoComponent } from './components/game-crono/game-crono.component';
import { ModalDialogModule } from './modules/modal-dialog/modal-dialog.module';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { GameGridComponent } from './components/game-grid/game-grid.component';
import { TileItemComponent } from './components/tile-item/tile-item.component';
import { GameMovementsComponent } from './components/game-movements/game-movements.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LanguageSelectorComponent,
    HeaderComponent,
    LevelSelectorComponent,
    GameButtonsComponent,
    GameCronoComponent,
    GameInfoComponent,
    GameGridComponent,
    TileItemComponent,
    GameMovementsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ModalDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
