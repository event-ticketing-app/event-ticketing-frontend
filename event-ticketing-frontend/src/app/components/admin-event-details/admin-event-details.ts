import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminEventResponse } from '../../services/admin-events';

@Component({
  selector: 'app-admin-event-details',
  imports: [DatePipe, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Event Details</h2>

      <div class="space-y-3 text-sm">
        <p><span class="font-semibold text-gray-700">Name:</span> {{ data.name }}</p>
        <p><span class="font-semibold text-gray-700">Description:</span> {{ data.description }}</p>
        <p><span class="font-semibold text-gray-700">Date:</span> {{ data.date | date:'dd/MM/yyyy' }}</p>
        <p><span class="font-semibold text-gray-700">Price:</span> {{ data.price }}</p>
        <p><span class="font-semibold text-gray-700">Ticket Capacity:</span> {{ data.ticketCapacity }}</p>
        <p><span class="font-semibold text-gray-700">Organizer:</span> {{ data.organizerName }}</p>
        <p><span class="font-semibold text-gray-700">Organizer Email:</span> {{ data.organizerEmail }}</p>
      </div>

      <div class="mt-6 flex justify-end">
        <button mat-raised-button color="primary" (click)="close()">Close</button>
      </div>
    </div>
  `,
})
export class AdminEventDetails {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminEventResponse,
    private dialogRef: MatDialogRef<AdminEventDetails>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
