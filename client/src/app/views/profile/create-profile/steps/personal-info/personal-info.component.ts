import { Component } from '@angular/core';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { environment } from '../../../../../../environments/environment.prod';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    BackComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
    NzSelectModule,
    FormsModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzSpaceModule,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
})
export class PersonalInfoComponent {
  isAuthenticated = false;
  apiUrl = environment.API_URL;
  loading = false;
  errorMessage = '';
  value = 100;
  date: Date | null = null;

  constructor(private i18n: NzI18nService) {}
  ngOnInit() {
    this.i18n.setLocale(en_US);
  }
}
