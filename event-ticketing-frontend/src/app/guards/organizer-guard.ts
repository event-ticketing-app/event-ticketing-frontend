import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const organizerGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(Auth);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) return true;

  const role = auth.getRole();
  if (role === 'Organizer' || role === 'Admin') {
    return true;
  }

  router.navigate(['/events']);
  return false;
};