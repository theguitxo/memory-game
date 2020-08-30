import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { Observable } from 'rxjs';
import { ModalDialogService } from './modules/modal-dialog/modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * constructor method
   * @param gameService instance for the services that manage the game 
   * @param modalDialogService instance for the service of the model dialog
   * @param translate instance for the service of translations
   */
  constructor(
    private gameService: GameService,
    private modalDialogService: ModalDialogService,
    private translate: TranslateService,
  ) {}

  /**
   * ngOnInit inits a subscription to control when user wins the game
   */
  ngOnInit(): void {
    this.gameService.winedGame.subscribe(
      (value) => {
        if (value) {
          this.modalDialogService.newDialog({
            title: this.translate.instant('finish-message.title'),
            message: this.translate.instant('finish-message.win-game'),
            clickOverlayCloses: true,
          });
          this.modalDialogService.openDialog();
        }
      }
    );
  }

  /**
   * returns if the game is started or not
   */
  getGameStarted(): Observable<boolean> {
    return this.gameService.started;
  }
}
