import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { EventService, EventResponse } from '../../services/event';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-event',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css',
})
export class EditEvent implements OnInit {
  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  name: string = '';
  description: string = '';
  date: Date = new Date();
  price: number = 0;
  imageUrl: string = '';
  ticketCapacity: number = 0;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(response => {
      this.name = response.name;
      this.description = response.description;
      this.date = new Date(response.date);
      this.price = response.price;
      this.imageUrl = response.imageUrl;
      this.ticketCapacity = response.ticketCapacity;
      this.cdr.detectChanges();
    });
  }

  updateEvent() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.putEvent(id, {
      name: this.name,
      description: this.description,
      date: this.date,
      price: this.price,
      imageUrl: this.imageUrl,
      ticketCapacity: this.ticketCapacity
    }).subscribe(() => {
      this.router.navigate(['/organizer-events']);
    });
  }
}