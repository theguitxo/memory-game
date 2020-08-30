import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { ModalDialogService } from './modal-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { Button } from './modal-dialog.interface';
import { buttonType } from './modal-dialog.enum';
import { trigger, transition, style, animate, state } from '@angular/animations';

const CLASS_BUTTON = {
  [`${buttonType.primary}`]: 'btn-primary',
  [`${buttonType.secondary}`]: 'btn-secondary',
  [`${buttonType.success}`]: 'btn-success',
  [`${buttonType.danger}`]: 'btn-danger',
  [`${buttonType.warning}`]: 'btn-warning',
  [`${buttonType.info}`]: 'btn-info',
  [`${buttonType.light}`]: 'btn-light',
  [`${buttonType.dark}`]: 'btn-dark',
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
            opacity: 0 
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

  constructor(
    private modalDialogService: ModalDialogService,
    private renderer: Renderer2,
  ) {}
  
  onAnimationEvent() {
    if (!this.isOpen) {
      this.renderer.setStyle(this._overlayRef.nativeElement, 'width', '0vw');
      this.renderer.setStyle(this._overlayRef.nativeElement, 'height', '0vh');
      this.modalDialogService.dialogIsClosed();       
    }
  }

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

  ngOnDestroy(): void {
    this.showDialogSubscription.unsubscribe();
  }

  getShowDialog(): Observable<boolean> {
    return this.modalDialogService.showDialog;
  }

  title(): string {
    return this.modalDialogService.title;
  };

  message(): string {
    return this.modalDialogService.message;
  };

  buttons(): Button[] {
    return this.modalDialogService.buttons;
  }

  actionButton(event: Event, button: Button) {
    event.stopPropagation();
    this.modalDialogService.actionButton(button.id);
  }

  classButton(item: Button): string {
    return CLASS_BUTTON[item.type ? item.type : buttonType.primary];
  }

  haveButtons():boolean {    
    return (this.buttons().length > 0);
  }

  closeDialog(event: Event): void {
    event.stopPropagation();
    this.modalDialogService.handleCloseDialog();
  }

  clickOnOverlay(event: Event): void {
    event.stopPropagation();
    if (this.modalDialogService.clickOverlayCloses) {
      this.closeDialog(event);
    }
  }

  clickOnModal(event: Event): void {
    event.stopPropagation();
  }
}