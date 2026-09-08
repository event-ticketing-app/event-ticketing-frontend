# event-ticketing-frontend

> Angular SPA for the event ticketing platform — consumes the [event-ticketing-backend](https://github.com/event-ticketing-app/event-ticketing-backend) REST API.

---

## About the Project

Built with Angular SSR, this frontend provides the user interface for the event ticketing platform. It connects to the .NET 8 backend via HTTP and handles authentication, event browsing and ticket purchasing.

> **Active development** — features are being added progressively. See the [Roadmap](#roadmap) for current status.

---

## Features

- **JWT Authentication** — login and register flow with token stored in localStorage
- **Role-Based Navigation** — different navbar/sidebar per role (User, Organizer, Admin)
- **Auth Service** — typed HTTP calls with `HttpClient` and `Observable` pattern
- **HTTP Interceptor** — automatically attaches JWT to all outgoing requests
- **Angular Material** — UI components for forms, cards, buttons and menus
- **Tailwind CSS** — utility-first CSS for layout and styling
- **Two-way binding** — reactive forms with `[(ngModel)]`
- **Angular Routing** — SPA navigation with `RouterOutlet`
- **SSR Compatible** — `isPlatformBrowser` guards for localStorage access in Node.js
- **Route Guards** — `authGuard`, `organizerGuard` and `guestGuard` for role-based protection
- **Event List** — displays all events in a responsive grid with images
- **Event Detail** — hero banner with blurred background, event info and reserve button
- **Ticket Reservation** — reserve a ticket directly from the event detail page
- **Ticket Purchase** — purchase flow with redirect to ticket detail page
- **My Tickets** — page showing all tickets for the authenticated user
- **Organizer Events** — page showing only events owned by the logged-in organizer
- **Create Event** — form for organizers to create new events with datepicker
- **Sidebar** — collapsible left sidebar for Organizer and Admin roles
- **Environment Config** — API URL centralized via Angular environments

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular (SSR) |
| Language | TypeScript |
| Styling | Angular Material + Tailwind CSS |
| HTTP | Angular HttpClient |
| Auth | JWT (stored in localStorage) |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── layout/             # Layout component — navbar or sidebar based on role
│   │   ├── navbar/             # Top navigation bar
│   │   ├── sidebar/            # Left sidebar for Organizer and Admin
│   │   ├── login/              # Login component
│   │   ├── register/           # Register component
│   │   ├── event-list/         # Event list with grid layout
│   │   ├── event-detail/       # Event detail with hero banner and reserve button
│   │   ├── ticket-detail/      # Ticket detail after purchase
│   │   ├── my-tickets/         # User's purchased tickets
│   │   ├── organizer-events/   # Organizer's own events
│   │   └── create-event/       # Create event form
│   ├── services/
│   │   ├── auth.ts             # Auth service — login, register, role and logout
│   │   ├── event.ts            # Event service — getEvents, getEventById, createEvent
│   │   ├── ticket.ts           # Ticket service — reserve, purchase, getTicket, getMyTickets
│   │   └── sidebar.ts          # Sidebar state service
│   ├── guards/
│   │   ├── auth.guard.ts       # Requires authenticated user
│   │   ├── organizer.guard.ts  # Requires Organizer or Admin role
│   │   └── guest.guard.ts      # Redirects logged-in users away from login/register
│   ├── interceptors/
│   │   └── auth-interceptor.ts # JWT interceptor
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── app.routes.ts           # Route configuration
│   ├── app.config.ts           # App configuration (HttpClient, Router, Interceptors)
│   └── app.html                # Root template
├── styles.css                  # Global styles
├── index.html
└── main.ts
```

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- Angular CLI (`npm install -g @angular/cli`)
- The [backend](https://github.com/event-ticketing-app/event-ticketing-backend) running locally

### Setup

1. **Clone the repository**

```
git clone https://github.com/event-ticketing-app/event-ticketing-frontend.git
cd event-ticketing-frontend
```

2. **Install dependencies**

```
npm install
```

3. **Run the app**

```
ng serve
```

Open `http://localhost:4200` in your browser.

> **Note:** Make sure the backend API is running on `http://localhost:5140` before starting the frontend.

---

## Navigation by Role

| Role | Navigation | Access |
|---|---|---|
| Not logged in | Top navbar | Events list, Login, Register |
| User | Top navbar | Events, My tickets, Profile dropdown |
| Organizer | Top navbar + Left sidebar | Events, My events, Create event, Profile dropdown |
| Admin | Top navbar + Left sidebar (blue) | Dashboard, Users, Events, Tickets |

---

## Roadmap

- [x] Project setup with Angular CLI
- [x] Login component with form and two-way binding
- [x] Register component
- [x] Auth service with typed HTTP calls
- [x] JWT stored in localStorage after login
- [x] Route configuration
- [x] Angular Material styling
- [x] Tailwind CSS
- [x] Redirect after login
- [x] Event list component (GET /api/events) with grid layout
- [x] Event detail component with hero banner
- [x] HTTP interceptor (attach JWT automatically)
- [x] SSR fix with isPlatformBrowser and ChangeDetectorRef
- [x] Ticket reservation from event detail page
- [x] Ticket purchase flow with redirect to ticket detail
- [x] My tickets page
- [x] Organizer events page (own events only)
- [x] Create event form with datepicker
- [x] Route guards (authGuard, organizerGuard, guestGuard)
- [x] Role-based navbar (User, Organizer, Admin)
- [x] Collapsible sidebar for Organizer
- [x] Environment config for API URL
- [ ] Admin panel (Dashboard, Users, Events, Tickets CRUD)
- [ ] Sidebar for Admin (blue theme)
- [ ] Edit event for Organizer
- [ ] Cancel reservation for User
- [ ] Search/filter events (search bar in navbar)
- [ ] User profile page
- [ ] Profile dropdown with avatar icon
- [ ] Chatbot (AI assistant)
- [ ] Stripe payment integration
- [ ] Responsive design (mobile)
- [ ] Skeleton loading
- [ ] Deployment

---

## Author

**Joel**
- GitHub: [@joeldc-dev](https://github.com/joeldc-dev)
- LinkedIn: [Joel Doña Corral](https://www.linkedin.com/in/joel-dona-corral/)
