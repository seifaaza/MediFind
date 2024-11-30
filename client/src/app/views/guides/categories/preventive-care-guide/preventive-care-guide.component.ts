import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-preventive-care-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './preventive-care-guide.component.html',
  styleUrl: './preventive-care-guide.component.css',
})
export class PreventiveCareGuideComponent {}
