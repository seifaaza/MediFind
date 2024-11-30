import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-mental-well-being-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './mental-well-being-guide.component.html',
  styleUrl: './mental-well-being-guide.component.css',
})
export class MentalWellBeingGuideComponent {}
