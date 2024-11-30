import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-nutrition-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './nutrition-guide.component.html',
  styleUrl: './nutrition-guide.component.css',
})
export class NutritionGuideComponent {}
