import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes with :id can't be prerendered at build time (ids come from the API).
  {
    path: 'events/:id',
    renderMode: RenderMode.Server
  },
  // Protected routes depend on the token in localStorage, which only exists in the browser.
  {
    path: 'tickets/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'edit-event/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
