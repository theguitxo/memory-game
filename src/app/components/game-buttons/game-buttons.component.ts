import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ModalDialogService } from 'src/app/modules/modal-dialog/modal-dialog.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { buttonType } from 'src/app/modules/modal-dialog/modal-dialog.enum';

const ID_ACCEPT_BUTTON = 'accept-button';
const ID_CANCEL_BUTTON = 'cancel-button';

@Component({
  selector: 'app-game-buttons',
  templateUrl: './game-buttons.component.html',
  styleUrls: ['./game-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameButtonsComponent implements OnInit, OnDestroy {

  private cancelAction: Subscription;

  constructor(
    public gameService: GameService,
    private modalDialogService: ModalDialogService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.cancelAction = this.modalDialogService.executeButton.subscribe((idAction) => {
      this.handleCancelAction(idAction);
    });
  }

  ngOnDestroy() {
    this.cancelAction.unsubscribe();
  }

  playGame(): void {
    this.gameService.startGame();
  }

  stopGame(): void {    
    this.gameService.stopGame();

    this.modalDialogService.newDialog({
      title: this.translate.instant('finish-dialog.title'),
      message: this.translate.instant('finish-dialog.message'),
      buttons: [
        {
          id: ID_ACCEPT_BUTTON,
          label: this.translate.instant(`finish-dialog.${ID_ACCEPT_BUTTON}`),
          type: buttonType.primary,
        },
        {
          id: ID_CANCEL_BUTTON,
          label: this.translate.instant(`finish-dialog.${ID_CANCEL_BUTTON}`),
          type: buttonType.secondary,
        },
      ],
      clickOverlayCloses: true,
      emitOnClose: true,
    });
    this.modalDialogService.openDialog();   
  }

  handleCancelAction(idAction: string): void {
    if (idAction === ID_ACCEPT_BUTTON) {
      this.modalDialogService.isClosed.subscribe(() => {
        this.modalDialogService.newDialog({
          title: this.translate.instant('finish-message.title'),
          message: this.translate.instant('finish-message.quit-game'),
          clickOverlayCloses: true,
        });
        this.modalDialogService.openDialog();
      });
      this.modalDialogService.closeDialog();      
      this.gameService.finishGame();
    } else if (idAction === ID_CANCEL_BUTTON || idAction === this.modalDialogService.closedCrossOverlay) {
      this.modalDialogService.closeDialog();
      this.gameService.restartCrono();
    }
  }
}
