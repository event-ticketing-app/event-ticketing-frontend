import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { EventList } from './components/event-list/event-list';


export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'events', component: EventList}
];
