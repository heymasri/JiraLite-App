import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Home</h2>
    <p>Welcome to JiraLite</p>
    <a routerLink="/projects">Go to Projects</a>
  `,
})
export class Home {}