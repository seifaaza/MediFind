import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-blood-donation',
  standalone: true,
  imports: [NzIconModule, NzButtonModule],
  templateUrl: './blood-donation.component.html',
  styleUrl: './blood-donation.component.css',
})
export class BloodDonationComponent {}
