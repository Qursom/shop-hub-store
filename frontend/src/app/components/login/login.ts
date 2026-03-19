import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api';
import { AuthService } from '@app/services/auth';

/**
 * Login Component
 *
 * Displays:
 * - Email and password input fields
 * - Form validation errors
 * - Loading state during authentication
 *
 * Features:
 * - Reactive form with email format and minimum password length validation
 * - Stores the access token via {@link AuthService} on success
 * - Redirects to `/products` after a successful login
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  /** Reactive form group containing `email` and `password` controls. */
  loginForm: FormGroup;

  /** `true` while an authentication request is in flight. */
  isLoading = false;

  /** Error message to display when login fails, or `null` when there is no error. */
  error: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Handles form submission.
   * Sends login credentials to the API and stores the returned token on success.
   * No-op if the form is invalid.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { email, password } = this.loginForm.value;

      this.apiService.post<{ accessToken: string }>('/auth/login', { email, password }).subscribe({
        next: (response) => {
          this.authService.setLoggedIn(response.accessToken);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Login failed. Please try again.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
