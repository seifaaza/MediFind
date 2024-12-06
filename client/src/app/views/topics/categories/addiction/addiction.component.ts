import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-addiction',
  standalone: true,
  imports: [BackComponent, NzIconModule, NzButtonModule, EmptyDataComponent],
  templateUrl: './addiction.component.html',
  styleUrl: './addiction.component.css',
})
export class AddictionComponent {}
