# EventTicketingFrontend

Angular 21 SSR frontend for the Event Ticketing platform. Connects to the .NET 8 backend API.

## Tech Stack

- Angular 21 (SSR)
- Angular Material
- Tailwind CSS
- JWT authentication

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI: `npm install -g @angular/cli`
- Backend running at `http://localhost:5000`

### Install dependencies

```bash
npm install
```

### Run development server

```bash
ng serve
```

Open `http://localhost:4200` in your browser.

## Project Structure

```
src/
  app/
    components/   # Feature components (admin-users, admin-events, admin-tickets...)
    services/     # HTTP services (auth, admin-users, admin-events, admin-tickets...)
    guards/       # Route guards (authGuard, adminGuard, guestGuard)
  environments/   # API URL config per environment
```

## Available Routes

| Route | Access | Description |
|---|---|---|
| `/events` | Public | Event listing |
| `/events/:id` | Public | Event detail |
| `/login` | Guest only | Login |
| `/register` | Guest only | Register |
| `/admin` | Admin | Dashboard |
| `/admin/users` | Admin | User management |
| `/admin/events` | Admin | Event management |
| `/admin/tickets` | Admin | Ticket management |

## Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

## Testing

```bash
ng test
```