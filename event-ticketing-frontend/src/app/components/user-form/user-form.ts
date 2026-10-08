import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AdminUserResponse } from '../../services/admin-users';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  @Input() user: AdminUserResponse | null = null;
  @Output() formSubmit = new EventEmitter<any>();

  name: string = '';
  email: string = '';
  password: string = '';
  role: number = 0;

  ngOnInit() {
    if (this.user) {
      this.name = this.user.name;
      this.email = this.user.email;
      this.role = typeof this.user.role === 'number' ? this.user.role : 0;
    }
  }

  submit() {
    this.formSubmit.emit({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    });
  }
}