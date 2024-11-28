import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeactivateAccountComponent } from './deactivate-account/deactivate-account.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-aside',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    DeactivateAccountComponent,
    RouterModule,
  ],
  templateUrl: './profile-aside.component.html',
  styleUrl: './profile-aside.component.css',
})
export class ProfileAsideComponent {}
