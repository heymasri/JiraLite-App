import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.scss'],
})
export class AuthLayout {}