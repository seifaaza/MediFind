import { Component } from '@angular/core';
import { BackHomeComponent } from '../../../core/components/buttons/back-home/back-home.component';
import { SignUpComponent } from '../../account/sign-up/sign-up.component';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [BackHomeComponent, SignUpComponent],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css',
})
export class CreateProfileComponent {}
