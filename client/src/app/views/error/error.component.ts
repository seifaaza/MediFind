import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackHomeComponent } from '../../core/components/back-home/back-home.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [BackHomeComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ErrorComponent {}
