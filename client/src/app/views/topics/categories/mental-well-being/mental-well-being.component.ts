import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-mental-well-being',
  standalone: true,
  imports: [BackComponent, NzIconModule, NzButtonModule, EmptyDataComponent],
  templateUrl: './mental-well-being.component.html',
  styleUrl: './mental-well-being.component.css',
})
export class MentalWellBeingComponent {}
