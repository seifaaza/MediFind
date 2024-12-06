import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [BackComponent, NzIconModule, NzButtonModule, EmptyDataComponent],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css',
})
export class FitnessComponent {}
