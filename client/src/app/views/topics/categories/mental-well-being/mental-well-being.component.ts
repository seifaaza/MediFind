import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-mental-well-being',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './mental-well-being.component.html',
  styleUrl: './mental-well-being.component.css',
})
export class MentalWellBeingComponent {}
