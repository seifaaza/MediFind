import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AboutComponent {}
