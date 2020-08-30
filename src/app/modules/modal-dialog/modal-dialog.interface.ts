import { ButtonType } from './modal-dialog.enum';

export interface Button {
  id: string;
  label: string;
  type?: ButtonType;
}

export interface Dialog {
  title: string;
  message: string;
  buttons?: Array<Button>;
  clickOverlayCloses?: boolean;
  emitOnClose?: boolean;
}
