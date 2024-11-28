import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [NzIconModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeaturesComponent {}
