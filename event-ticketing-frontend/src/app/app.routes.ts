import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { EventList } from './components/event-list/event-list';
import { EventDetail } from './components/event-detail/event-detail';
import { TicketDetail } from './components/ticket-detail/ticket-detail';
import { MyTickets} from './components/my-tickets/my-tickets';
import { OrganizerEvents} from './components/organizer-events/organizer-events';
import { CreateEvent} from './components/create-event/create-event';
import { authGuard } from './guards/auth-guard';
import { organizerGuard } from './guards/organizer-guard';
import { guestGuard } from './guards/guest-guard';



export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard] },
    { path: 'register', component: Register, canActivate: [guestGuard] },
    { path: 'events', component: EventList},
    { path: 'events/:id', component: EventDetail},
    { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard]  },
    { path: 'my-tickets', component: MyTickets, canActivate: [authGuard]  },
    { path: 'organizer-events', component: OrganizerEvents, canActivate: [organizerGuard] },
    { path: 'create-event', component: CreateEvent, canActivate: [organizerGuard] }
];
