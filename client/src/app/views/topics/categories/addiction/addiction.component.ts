import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-addiction',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './addiction.component.html',
  styleUrl: './addiction.component.css',
})
export class AddictionComponent {}
