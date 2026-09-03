import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-event',
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEvent
{constructor(private eventService: EventService, private router: Router){}

  name: string = '';
  description: string = '';
  date: Date = new Date();
  price: number = 0;
  imageUrl: string= '';
  ticketCapacity: number = 0;

  createEvent(){
      this.eventService.createEvent({
        name: this.name,
        description: this.description,
        date: this.date,
        price: this.price,
        imageUrl: this.imageUrl,
        ticketCapacity: this.ticketCapacity
      }).subscribe(response => {
        this.router.navigate(['/organizer-events']);
     })
    }
}
