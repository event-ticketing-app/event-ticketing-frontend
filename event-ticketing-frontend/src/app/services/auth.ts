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
const NAME_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

/** Expiry time of the JWT in ms ("exp" claim), or null if the token can't be read. */
function getTokenExpiry(token: string): number | null {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);
  return expiry === null || expiry <= Date.now();
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Single source of truth for the session. Components read these signals,
  // so Angular is notified of every login/logout instead of re-reading localStorage.
  private readonly token = signal<string | null>(null);
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

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

  /** Id of the logged-in user (the backend puts it in the "sub" claim of the JWT). */
  readonly userId = computed<number | null>(() => {
    const token = this.token();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      const id = Number(decoded.sub ?? decoded[NAME_ID_CLAIM]);
      return Number.isFinite(id) ? id : null;
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
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored && !isTokenExpired(stored)) {
        this.startSession(stored);
      } else if (stored) {
        // Token from an old session that already expired
        localStorage.removeItem(TOKEN_KEY);
      }
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
    this.startSession(token);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getRole(): string | null {
    return this.role();
  }

  getUserId(): number | null {
    return this.userId();
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/events']);
  }

  /** The session is no longer valid (token expired or rejected with 401): sign out and go to login. */
  expireSession(): void {
    if (!this.token()) return;
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Sets the token and schedules an automatic sign-out when it expires. */
  private startSession(token: string): void {
    this.token.set(token);
    this.clearExpiryTimer();

    const expiry = getTokenExpiry(token);
    if (expiry === null || !isPlatformBrowser(this.platformId)) return;

    // setTimeout can't wait more than ~24.8 days; tokens here last 1 day
    const delay = Math.min(expiry - Date.now(), 2_147_483_647);
    this.expiryTimer = setTimeout(() => this.expireSession(), Math.max(delay, 0));
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.clearExpiryTimer();
    this.token.set(null);
  }

  private clearExpiryTimer(): void {
    if (this.expiryTimer !== null) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }
}
