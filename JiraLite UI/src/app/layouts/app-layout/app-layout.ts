import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.scss'],
})
export class AppLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}