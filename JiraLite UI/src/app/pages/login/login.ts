import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone); // ✅ added

  error = '';
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    localStorage.removeItem('jiralite_token');

    const dto = this.form.getRawValue();

    this.auth.login(dto as any).subscribe({
      next: () => {
        this.loading = false;

        // ensure routing happens inside Angular zone
        this.zone.run(() => {
          this.router.navigateByUrl('/projects');
        });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Invalid email or password';
      }
    });
  }
}