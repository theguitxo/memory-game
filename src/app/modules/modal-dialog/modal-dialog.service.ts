import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Button, Dialog } from './modal-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalDialogService {

  private showDialog$ = new BehaviorSubject<boolean>(false);
  private executeButton$ = new Subject<string>();
  private isClosed$ = new Subject<void>();

  private title$: string;
  private message$: string;
  private buttons$: Button[] = [];
  private clickOverlayCloses$: boolean;
  private emitOnClose$: boolean;

  private dialogSet$ = false;
  private readonly closedCrossOverlay$: string = 'closed.cross.overlay';

  /* GETTERS AND SETTERS */

  /* OBSERVABLES */
  get showDialog(): Observable<boolean> {
    return this.showDialog$.asObservable();
  }
  get executeButton(): Observable<string> {
    return this.executeButton$.asObservable();
  }
  get isClosed(): Observable<void> {
    return this.isClosed$.asObservable();
  }

  /* PROPERTIES */
  get title(): string {
    return this.title$;
  }
  set title(value: string) {
    this.title$ = value;
  }
  get message(): string {
    return this.message$;
  }
  set message(value: string) {
    this.message$ = value;
  }
  set button(value: Button) {
    this.buttons$.push(value);
  }
  get buttons(): Button[] {
    return this.buttons$;
  }
  get clickOverlayCloses(): boolean {
    return this.clickOverlayCloses$;
  }
  get closedCrossOverlay(): string {
    return this.closedCrossOverlay$;
  }
  get dialogSet(): boolean {
    return this.dialogSet$;
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
    this.title$ = data.title;
    this.message$ = data.message;
    this.buttons$ = data.buttons ? data.buttons : [];
    this.clickOverlayCloses$ = data.clickOverlayCloses ? data.clickOverlayCloses : false;
    this.emitOnClose$ = data.emitOnClose !== undefined ? data.emitOnClose : false;
    this.dialogSet$ = true;
  }

  /**
   * opens the modal dialog
   */
  openDialog(): void {
    if (this.dialogSet$) {
      this.showDialog$.next(true);
    } else {
      console.error(`Dialog data not set!`);
    }
  }

  /**
   * handle the behavior of buttons when are clicked
   */
  handleCloseDialog(): void {
    this.executeButton$.next(this.closedCrossOverlay);
    this.closeDialog();
  }

  /**
   * closes the dialog modal
   */
  closeDialog(): void {
    this.showDialog$.next(false);
    this.title$ = '';
    this.message$ = '';
    this.buttons$ = [];
    this.dialogSet$ = false;
  }

  /**
   * emits an event when a button is clicked
   * @param id identificator of the action of the button
   */
  actionButton(id: string): void {
    this.executeButton$.next(id);
  }

  /**
   * emits that the modal has closed
   */
  dialogIsClosed(): void {
    if (this.emitOnClose$) {
      this.isClosed$.next();
    }
  }
}
