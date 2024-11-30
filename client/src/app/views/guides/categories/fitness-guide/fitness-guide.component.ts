import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-fitness-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './fitness-guide.component.html',
  styleUrl: './fitness-guide.component.css',
})
export class FitnessGuideComponent {}
