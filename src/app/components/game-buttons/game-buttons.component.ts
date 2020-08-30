import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ModalDialogService } from 'src/app/modules/modal-dialog/modal-dialog.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ButtonType } from 'src/app/modules/modal-dialog/modal-dialog.enum';

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

  /**
   * constructor method
   * @param gameService instance of the service that manage the game
   * @param modalDialogService instance of the service for the modal dialog
   * @param translate instance of the service for translations
   */
  constructor(
    public gameService: GameService,
    private modalDialogService: ModalDialogService,
    private translate: TranslateService,
  ) { }

  /**
   * ngOnInit
   * starts a subscription for the buttons of the dialog modal
   */
  ngOnInit() {
    this.cancelAction = this.modalDialogService.executeButton.subscribe((idAction) => {
      this.handleCancelAction(idAction);
    });
  }

  /**
   * ngOnDestroy
   * removes the subscription for the buttons of the dialog model
   */
  ngOnDestroy() {
    this.cancelAction.unsubscribe();
  }

  /**
   * playGame
   * starts the game
   */
  playGame(): void {
    this.gameService.startGame();
  }

  /**
   * stopGame
   * stops the game
   */
  stopGame(): void {
    this.gameService.stopGame();

    this.modalDialogService.newDialog({
      title: this.translate.instant('finish-dialog.title'),
      message: this.translate.instant('finish-dialog.message'),
      buttons: [
        {
          id: ID_ACCEPT_BUTTON,
          label: this.translate.instant(`finish-dialog.${ID_ACCEPT_BUTTON}`),
          type: ButtonType.primary,
        },
        {
          id: ID_CANCEL_BUTTON,
          label: this.translate.instant(`finish-dialog.${ID_CANCEL_BUTTON}`),
          type: ButtonType.secondary,
        },
      ],
      clickOverlayCloses: true,
      emitOnClose: true,
    });
    this.modalDialogService.openDialog();
  }

  /**
   * handelCancelAction
   * manages the actions when the user cancels a dialog
   * @param idAction identificator for the action of the button
   */
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
