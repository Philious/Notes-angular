import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import { DialogComponent } from '../app/components/modals/dialog.component';
import { actionButton } from '../helpers/types';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRef!: ComponentRef<DialogComponent>;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) { }

  open(actionButtons: actionButton[], title?: string, content?: string): void {
    const dialogRef = createComponent(DialogComponent, {
      environmentInjector: this.environmentInjector,
    });
    dialogRef.instance.title = title;
    dialogRef.instance.content = content;
    dialogRef.instance.actionButtons = actionButtons;
    dialogRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(dialogRef.hostView);
    document.getElementById('app')!.appendChild(dialogRef.location.nativeElement);

    this.dialogRef = dialogRef;
  }

  close(): void {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
    }
  }
}
