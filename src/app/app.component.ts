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
  constructor(
    private gameService: GameService,
    private modalDialogService: ModalDialogService,
    private translate: TranslateService,
  ) {}

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

  getGameStarted(): Observable<boolean> {
    return this.gameService.started;
  }
}
