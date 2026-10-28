import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
}

const TOKEN_KEY = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Single source of truth for the session. Components read these signals,
  // so Angular is notified of every login/logout instead of re-reading localStorage.
  private readonly token = signal<string | null>(null);

  readonly loggedIn = computed(() => this.token() !== null);
  readonly role = computed<string | null>(() => {
    const token = this.token();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded[ROLE_CLAIM] ?? null;
    } catch {
      return null;
    }
  });

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token.set(localStorage.getItem(TOKEN_KEY));
    }
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, { email, password });
  }

  register(name: string, email: string, password: string, role: string = 'User') {
    const roleValue = role === 'Organizer' ? 1 : 0;
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, { name, email, password, role: roleValue });
  }

  /** Stores the token after login/register and updates the session state. */
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    this.token.set(token);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getRole(): string | null {
    return this.role();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.token.set(null);
    this.router.navigate(['/events']);
  }
}
