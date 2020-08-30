import {
  Component, ChangeDetectionStrategy,
  OnInit, OnDestroy, Renderer2, ViewChild, ElementRef,
} from '@angular/core';
import { ModalDialogService } from './modal-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { Button } from './modal-dialog.interface';
import { ButtonType } from './modal-dialog.enum';
import { trigger, transition, style, animate, state } from '@angular/animations';

const CLASS_BUTTON = {
  [`${ButtonType.primary}`]: 'btn-primary',
  [`${ButtonType.secondary}`]: 'btn-secondary',
  [`${ButtonType.success}`]: 'btn-success',
  [`${ButtonType.danger}`]: 'btn-danger',
  [`${ButtonType.warning}`]: 'btn-warning',
  [`${ButtonType.info}`]: 'btn-info',
  [`${ButtonType.light}`]: 'btn-light',
  [`${ButtonType.dark}`]: 'btn-dark',
};

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalState', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-25vh)'
        }),
        animate('1s', style(
          {
            opacity: 1,
            transform: 'translateY(0)'
          }
        )),
      ]),
      transition(':leave', [
        animate('500ms', style(
          {
            opacity: 0,
          }
        ))
      ])
    ]),
  ],
})
export class ModalDialogComponent implements OnInit, OnDestroy {
  private showDialogSubscription: Subscription;
  private _overlayRef: ElementRef;
  @ViewChild('overlay') set overlayRef(overlayRef: ElementRef) {
    this._overlayRef = overlayRef;
  }

  private isOpen: boolean;

  /**
   * constructor method
   * @param modalDialogService instance of the service for dialog modal
   * @param renderer instance of the angular renderer service
   */
  constructor(
    private modalDialogService: ModalDialogService,
    private renderer: Renderer2,
  ) {}
  
  /**
   * fires when the animation of modal dialog is finished
   */
  onAnimationEvent() {
    if (!this.isOpen) {
      this.renderer.setStyle(this._overlayRef.nativeElement, 'width', '0vw');
      this.renderer.setStyle(this._overlayRef.nativeElement, 'height', '0vh');
      this.modalDialogService.dialogIsClosed();       
    }
  }

  /**
   * ngOnInit
   * inits a subscription for control when it must show the dialog
   */
  ngOnInit(): void {
    this.showDialogSubscription = this.modalDialogService.showDialog.subscribe((value) => {
      this.isOpen = value;
      if (value) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
        this.renderer.setStyle(this._overlayRef.nativeElement, 'width', '100vw');
        this.renderer.setStyle(this._overlayRef.nativeElement, 'height', '100vh');
      } else {
        this.renderer.removeStyle(document.body, 'overflow');
      }     
    });
  }

  /**
   * ngOnDestroy
   * removes the subscription for show the modal
   */
  ngOnDestroy(): void {
    this.showDialogSubscription.unsubscribe();
  }

  /**
   * returns if must show the dialog or not
   */
  getShowDialog(): Observable<boolean> {
    return this.modalDialogService.showDialog;
  }

  /**
   * returns the title for the dialog
   */
  title(): string {
    return this.modalDialogService.title;
  };

  /**
   * returns the message for the dialog
   */
  message(): string {
    return this.modalDialogService.message;
  };

  /**
   * returns the buttons to show in the dialog
   */
  buttons(): Button[] {
    return this.modalDialogService.buttons;
  }

  /**
   * executes the action of a button when is pressed
   * @param event the event emitted by the click of the button
   * @param button button that has clicked
   */
  actionButton(event: Event, button: Button) {
    event.stopPropagation();
    this.modalDialogService.actionButton(button.id);
  }

  /**
   * get the class to apply to the button
   * @param item the button to get the class
   */
  classButton(item: Button): string {
    return CLASS_BUTTON[item.type ? item.type : ButtonType.primary];
  }

  /**
   * return if the dialog has buttons or not
   */
  haveButtons():boolean {    
    return (this.buttons().length > 0);
  }

  /**
   * closes the dialog
   * @param event event emitted on click over close button
   */
  closeDialog(event: Event): void {
    event.stopPropagation();
    this.modalDialogService.handleCloseDialog();
  }

  /**
   * executes the action on click on the overlay
   * @param event event emitted on click over the overlay of the dialog
   */
  clickOnOverlay(event: Event): void {
    event.stopPropagation();
    if (this.modalDialogService.clickOverlayCloses) {
      this.closeDialog(event);
    }
  }

  /**
   * stops the propagation of the click event on click on the modal
   * @param event event emitted on click over the modal
   */
  clickOnModal(event: Event): void {
    event.stopPropagation();
  }
}