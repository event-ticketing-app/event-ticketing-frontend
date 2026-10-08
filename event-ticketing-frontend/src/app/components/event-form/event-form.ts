import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminEventResponse } from '../../services/admin-events';
import { AdminUsersService, AdminUserResponse } from '../../services/admin-users';

@Component({
  selector: 'app-event-form',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
  @Input() event: AdminEventResponse | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  organizers: AdminUserResponse[] = [];
  name: string = '';
  description: string = '';
  date: string = '';
  price: number = 0;
  ticketCapacity: number = 0;
  imageUrl: string = '';
  organizerId: number = 0;

  constructor(private adminUsersService: AdminUsersService) {}

  ngOnInit() {
    this.adminUsersService.getOrganizers().subscribe(response => {
      this.organizers = response;

      if (!this.event && this.organizers.length > 0) {
        this.organizerId = this.organizers[0].id;
      }
    });

    if (this.event) {
      this.name = this.event.name;
      this.description = this.event.description;
      this.date = this.event.date ?? '';
      this.price = this.event.price;
      this.ticketCapacity = this.event.ticketCapacity;
      this.imageUrl = this.event.imageUrl ?? '';
    }
  }

  submit() {
    this.formSubmit.emit({
      name: this.name,
      description: this.description,
      date: this.date,
      price: this.price,
      ticketCapacity: this.ticketCapacity,
      imageUrl: this.imageUrl,
      organizerId: this.organizerId
    });
  }
}
