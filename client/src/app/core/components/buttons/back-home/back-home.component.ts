import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-back-home',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, RouterModule],
  templateUrl: './back-home.component.html',
  styleUrl: './back-home.component.css',
})
export class BackHomeComponent {}
