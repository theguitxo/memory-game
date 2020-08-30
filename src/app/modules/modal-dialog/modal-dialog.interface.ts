import { buttonType } from './modal-dialog.enum';

export interface Button {
  id: string;
  label: string;
  type?: buttonType;
}

export interface Dialog {
  title: string;
  message: string;
  buttons?: Array<Button>;
  clickOverlayCloses?: boolean;
  emitOnClose?: boolean;
}