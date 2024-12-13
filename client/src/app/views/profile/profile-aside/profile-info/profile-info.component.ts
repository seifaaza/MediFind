import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, NzButtonComponent, NzIconModule, RouterModule],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css',
})
export class ProfileInfoComponent {
  hasProfile: boolean | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the hasProfile observable
    this.authService.getHasProfile().subscribe((hasProfile) => {
      this.hasProfile = hasProfile;
    });
  }
}
