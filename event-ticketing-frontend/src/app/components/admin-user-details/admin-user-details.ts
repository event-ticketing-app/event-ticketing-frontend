import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminUserResponse } from '../../services/admin-users';

@Component({
  selector: 'app-admin-user-details',
  imports: [MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">User Details</h2>

      <div class="space-y-3 text-sm">
        <p><span class="font-semibold text-gray-700">Name:</span> {{ data.name }}</p>
        <p><span class="font-semibold text-gray-700">Email:</span> {{ data.email }}</p>
        <p><span class="font-semibold text-gray-700">Role:</span> {{ roleLabel }}</p>
      </div>

      <div class="mt-6 flex justify-end">
        <button mat-raised-button color="primary" (click)="close()">Close</button>
      </div>
    </div>
  `,
})
export class AdminUserDetails {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminUserResponse,
    private dialogRef: MatDialogRef<AdminUserDetails>
  ) {}

  get roleLabel() {
    if (this.data.role === 0 || this.data.role === '0' || this.data.role === 'Admin') return 'Admin';
    if (this.data.role === 1 || this.data.role === '1' || this.data.role === 'Organizer') return 'Organizer';
    return 'User';
  }

  close() {
    this.dialogRef.close();
  }
}
