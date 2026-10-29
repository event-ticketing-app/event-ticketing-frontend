import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminEventResponse } from '../../services/admin-events';
import { getEventStatusClasses, getEventStatusLabel } from '../../services/event-status';

@Component({
  selector: 'app-admin-event-details',
  imports: [DatePipe, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
      @if (data.imageUrl) {
        <img [src]="data.imageUrl" [alt]="data.name" class="w-full rounded-xl object-cover border border-gray-200 mb-4" />
      } @else {
        <div class="w-full h-32 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500 mb-4">
          No image
        </div>
      }

      <div class="space-y-3 text-sm">
        <p><span class="font-semibold text-gray-700">Name:</span> {{ data.name }}</p>
        <p><span class="font-semibold text-gray-700">Status:</span> <span class="inline-flex px-2.5 py-0.5 rounded-full border text-xs font-semibold" [class]="statusClasses(data.status)">{{ statusLabel(data.status) }}</span></p>
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
  readonly statusLabel = getEventStatusLabel;
  readonly statusClasses = getEventStatusClasses;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdminEventResponse,
    private dialogRef: MatDialogRef<AdminEventDetails>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
