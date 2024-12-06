import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EmptyDataComponent } from '../../../../core/errors/empty-data/empty-data.component';

@Component({
  selector: 'app-preventive-care',
  standalone: true,
  imports: [BackComponent, NzIconModule, NzButtonModule, EmptyDataComponent],
  templateUrl: './preventive-care.component.html',
  styleUrl: './preventive-care.component.css',
})
export class PreventiveCareComponent {}
