import { Component } from '@angular/core';
import { BackComponent } from '../../../../../core/components/buttons/back/back.component';
import { environment } from '../../../../../../environments/environment.prod';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';
import { FormService } from '../../../../../core/services/profile/form.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    BackComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzAlertModule,
    NzSelectModule,
    FormsModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzSpaceModule,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
})
export class PersonalInfoComponent {
  isAuthenticated = false;
  apiUrl = environment.API_URL;
  loading = false;
  errorMessage = '';
  form: FormGroup;
  date: Date | null = null;
  selectedUnitHeight = '';
  selectedUnitWeight = '';
  weight: number | null = null;
  height: number | null = null;

  constructor(
    private fb: FormBuilder,
    private i18n: NzI18nService,
    private formService: FormService
  ) {
    this.form = this.fb.group({
      gender: [null],
      birthday: [null, [Validators.required, this.ageValidator]],
      height: [null, [Validators.required, Validators.min(50)]], // Default value for height
      weight: [null, [Validators.required, Validators.min(40)]], // Default value for weight
      heightUnit: ['cm'], // Default unit for height
      weightUnit: ['kg'], // Default unit for weight
    });
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
  }

  // Custom validator to check if the date is more than 10 years ago
  ageValidator(control: any) {
    const dateOfBirth = control.value;
    if (dateOfBirth) {
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      const month = today.getMonth() - dateOfBirth.getMonth();
      if (
        month < 0 ||
        (month === 0 && today.getDate() < dateOfBirth.getDate())
      ) {
        age--;
      }
      return age >= 10 ? null : { minAge: true };
    }
    return null;
  }

  // Method to handle form submission
  onSubmit() {
    if (this.form.valid) {
      // Set the form data in the service
      this.formService.setFormData('date_of_birth', this.form.value.birthday);
      this.formService.setFormData('gender', this.form.value.gender);
      this.formService.setFormData('height', this.form.value.height);
      this.formService.setFormData('weight', this.form.value.weight);

      console.log('Form data saved:', this.formService.getFormData());

      // Call submit method (replace this with actual submission logic)
      this.formService.submitFormData();
    } else {
      console.log('Form is invalid');
    }
  }

  // Unit change for height
  onHeightUnitChange(unit: string) {
    this.selectedUnitHeight = unit;
    this.form.get('heightUnit')?.setValue(unit); // Update form control
  }

  // Update height and weight when inputs are changed// Update height value when input changes
  onHeightChange(value: number) {
    this.height = value;
  }

  // Unit change for weight
  onWeightUnitChange(unit: string) {
    this.selectedUnitWeight = unit;
    this.form.get('weightUnit')?.setValue(unit); // Update form control
  }

  onWeightChange(value: number) {
    this.weight = value;
  }
}
