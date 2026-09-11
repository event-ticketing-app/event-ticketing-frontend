import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [FormsModule,MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register 
{constructor(private authService: Auth, private router: Router, private route: ActivatedRoute){}

  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'User';

  ngOnInit(){
  const roleParam = this.route.snapshot.queryParamMap.get('role');
    if (roleParam === 'organizer') {
      this.role = 'Organizer';
    }
  }
  register(){
    this.authService.register(this.name, this.email, this.password, this.role).subscribe(response =>{
      localStorage.setItem('token', response.token);
      this.router.navigate(['/events']);
    })
  }

}
