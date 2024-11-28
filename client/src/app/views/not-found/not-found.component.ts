import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackHomeComponent } from '../../core/components/back-home/back-home.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [BackHomeComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotFoundComponent {}
