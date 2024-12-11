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
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
})
export class PersonalInfoComponent {
  apiUrl = environment.API_URL;
  loading = false;
  errorMessage = '';
}
