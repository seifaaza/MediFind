import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [BackComponent, NzIconModule, NzButtonModule, EmptyDataComponent],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css',
})
export class NutritionComponent {}
