import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventResponse, EventService } from '../../services/event';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  showPassword = false;
  loading = false;
  errorMessage = '';
  trendingEvent: EventResponse | null = null;

  loginForm;

  constructor(private authService: Auth, private router: Router, private fb: FormBuilder, private eventService: EventService) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadTrendingEvent();
  }

  loadTrendingEvent() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        if (!events.length) return;
        this.trendingEvent = [...events].sort((a, b) => b.id - a.id)[0];
      },
      error: () => {
        this.trendingEvent = null;
      },
    });
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        const role = this.authService.getRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/events']);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
