import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-modal',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, RouterLink],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
})
export class LoginModal {
  isOrganizer: boolean = false;

  constructor(
    private authService: Auth,
    private router: Router,
    private dialogRef: MatDialogRef<LoginModal>
  ) {}

  email: string = '';
  password: string = '';

  errorMessage = '';
  loading = false;

  login() {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.dialogRef.close();
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
}