import { Component } from '@angular/core';
import { BackHomeComponent } from '../../../core/components/buttons/back-home/back-home.component';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [BackHomeComponent],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css',
})
export class CreateProfileComponent {}
