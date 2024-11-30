import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-back',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './back.component.html',
  styleUrl: './back.component.css',
})
export class BackComponent {
  constructor(private location: Location) {}
  goBack() {
    this.location.back(); // Navigates back in the browser's history
  }
}
