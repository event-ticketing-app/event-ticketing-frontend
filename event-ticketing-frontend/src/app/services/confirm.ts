import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, map } from 'rxjs';
import { ConfirmDialog, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private dialog: MatDialog) {}

  /** Opens a confirmation popup. Emits only if the user clicks the confirm button. */
  ask(data: ConfirmDialogData): Observable<true> {
    return this.dialog
      .open(ConfirmDialog, { width: '420px', data })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        map(() => true as const),
      );
  }
}
