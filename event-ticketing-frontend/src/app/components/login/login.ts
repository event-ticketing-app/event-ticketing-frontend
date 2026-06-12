import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule,MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',


})
export class Login 
{
  constructor(private authService: Auth, private router: Router){}

  email: string = '';
  password: string = '';

  login(){
    this.authService.login(this.email, this.password).subscribe(response => {
      localStorage.setItem('token', response.token);
      console.log('Token guardado', response.token);
      this.router.navigate(['/events']);
    });
  }
}
