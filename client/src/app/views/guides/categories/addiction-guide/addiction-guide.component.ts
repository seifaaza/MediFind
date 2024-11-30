import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-addiction-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './addiction-guide.component.html',
  styleUrl: './addiction-guide.component.css',
})
export class AddictionGuideComponent {}
