# event-ticketing-frontend

> Angular SPA for the event ticketing platform — consumes the [event-ticketing-backend](https://github.com/event-ticketing-app/event-ticketing-backend) REST API.

---

## About the Project

Built with Angular, this frontend provides the user interface for the event ticketing platform. It connects to the .NET 8 backend via HTTP and handles authentication, event browsing and ticket purchasing.

> **Active development** — features are being added progressively. See the [Roadmap](#roadmap) for current status.

---

## Features

- **JWT Authentication** — login flow with token stored in localStorage
- **Auth Service** — typed HTTP calls with `HttpClient` and `Observable` pattern
- **Reactive Forms** — two-way binding with `[(ngModel)]`
- **Angular Routing** — SPA navigation with `RouterOutlet`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular |
| Language | TypeScript |
| Styling | Angular Material (coming soon) |
| HTTP | Angular HttpClient |
| Auth | JWT (stored in localStorage) |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── login/              # Login component
│   ├── services/
│   │   └── auth.ts             # Auth service — login HTTP call
│   ├── app.routes.ts           # Route configuration
│   ├── app.config.ts           # App configuration (HttpClient, Router)
│   └── app.html                # Root template with router-outlet
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

## Roadmap

- [x] Project setup with Angular CLI
- [x] Login component with form and two-way binding
- [x] Auth service with typed HTTP call
- [x] JWT stored in localStorage after login
- [x] Route configuration
- [ ] Angular Material styling
- [ ] Redirect after login
- [ ] Event list component (GET /api/events)
- [ ] Route guards (protect authenticated routes)
- [ ] HTTP interceptor (attach JWT automatically)
- [ ] Register component
- [ ] Ticket reservation flow
- [ ] Admin panel

---

## Author

**Joel**
- GitHub: [@joeldc-dev](https://github.com/joeldc-dev)
- LinkedIn: [Joel Doña Corral](https://www.linkedin.com/in/joel-dona-corral/)
