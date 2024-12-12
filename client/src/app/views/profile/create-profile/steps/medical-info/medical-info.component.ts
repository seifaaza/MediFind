import { Component } from '@angular/core';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { environment } from '../../../../../../environments/environment.prod';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-medical-info',
  standalone: true,
  imports: [BackComponent, CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './medical-info.component.html',
  styleUrl: './medical-info.component.css',
})
export class MedicalInfoComponent {
  isAuthenticated = false;
  apiUrl = environment.API_URL;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}
}
