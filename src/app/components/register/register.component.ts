import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = { name: '', email: '', password: '' };
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/notes']);
    }
  }

  onSubmit() {
    this.authService.register(this.userData).subscribe({
      next: () => this.router.navigate(['/notes']),
      error: err => this.error = err.error.message || 'Registration failed'
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
