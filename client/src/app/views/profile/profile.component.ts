import { Component } from '@angular/core';
import { ProfileAsideComponent } from './profile-aside/profile-aside.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileAsideComponent, RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {}
