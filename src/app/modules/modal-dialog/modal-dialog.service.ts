import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Button, Dialog } from './modal-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalDialogService {

  private _showDialog = new BehaviorSubject<boolean>(false);
  private _executeButton = new Subject<string>();
  private _isClosed = new Subject<void>();

  private _title: string;
  private _message: string;
  private _buttons: Button[] = [];
  private _clickOverlayCloses: boolean;
  private _emitOnClose: boolean;

  private _dialogSet: boolean = false;
  private readonly _closedCrossOverlay: string = 'closed.cross.overlay';

  /* GETTERS AND SETTERS */

  /* OBSERVABLES */
  get showDialog(): Observable<boolean> {
    return this._showDialog.asObservable();
  }
  get executeButton(): Observable<string> {
    return this._executeButton.asObservable();
  }
  get isClosed(): Observable<void> {
    return this._isClosed.asObservable();
  }

  /* PROPERTIES */
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }
  get message(): string {
    return this._message;
  }
  set message(value: string) {
    this._message = value;
  }
  set button(value: Button) {
    this._buttons.push(value);
  }
  get buttons(): Button[] {
    return this._buttons;
  }
  get clickOverlayCloses(): boolean {
    return this._clickOverlayCloses;
  }
  get closedCrossOverlay(): string {
    return this._closedCrossOverlay;
  }
  get dialogSet(): boolean {
    return this._dialogSet;
  }

  /**
   * constructor method
   */
  constructor() {}

  /**
   * sets the values for open a modal dialog
   * @param data Dialog object with the values needed for open the dialog
   */
  newDialog(data: Dialog): void {
    this._title = data.title;
    this._message = data.message;
    this._buttons = data.buttons ? data.buttons : [];
    this._clickOverlayCloses = data.clickOverlayCloses ? data.clickOverlayCloses : false;
    this._emitOnClose = data.emitOnClose !== undefined ? data.emitOnClose : false;
    this._dialogSet = true;
  }

  /**
   * opens the modal dialog
   */
  openDialog(): void {
    if (this._dialogSet) {
      this._showDialog.next(true);
    } else {
      console.error(`Dialog data not set!`);
    }
  }

  /**
   * 
   */
  handleCloseDialog(): void {
    this._executeButton.next(this.closedCrossOverlay);
    this.closeDialog();
  }

  /**
   * closes the dialog modal
   */
  closeDialog(): void {
    this._showDialog.next(false);
    this._title = '';
    this._message = '';
    this._buttons = [];
    this._dialogSet = false;
  }

  /**
   * emits an event when a button is clicked
   * @param id identificator of the action of the button
   */
  actionButton(id: string): void {
    this._executeButton.next(id);
  }

  /**
   * emits that the modal has closed
   */
  dialogIsClosed(): void {
    if (this._emitOnClose) {
      this._isClosed.next();
    }
  }
}