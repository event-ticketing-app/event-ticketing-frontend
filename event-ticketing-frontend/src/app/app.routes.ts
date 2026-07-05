import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { EventList } from './components/event-list/event-list';
import { EventDetail } from './components/event-detail/event-detail';



export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'events', component: EventList},
    { path: 'events/:id', component: EventDetail}
];
