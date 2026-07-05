import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'


@Component({
  selector: 'app-register',
  imports: [FormsModule,MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register 
{constructor(private authService: Auth, private router: Router){}

  name: string = '';
  email: string = '';
  password: string = '';

  register(){
    this.authService.register(this.name, this.email, this.password).subscribe(response =>{
      localStorage.setItem('token', response.token);
      this.router.navigate(['/events']);
    })
  }

}
