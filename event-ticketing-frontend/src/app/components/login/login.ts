import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login 
{
  constructor(private authService: Auth){}

  email: string = '';
  password: string = '';

  login(){
    this.authService.login(this.email, this.password).subscribe(response => {
      console.log(response);
    });
  }
}
