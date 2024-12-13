import { Component, inject } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
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

  private fb = inject(FormBuilder);
  private i18n = inject(NzI18nService);
  private formService = inject(FormService);

  constructor(private router: Router) {
    this.form = this.fb.group({
      gender: [null],
      birthday: [null, [this.ageValidator]],
      height: [null, [Validators.min(50)]],
      weight: [null, [Validators.min(40)]],
      heightUnit: ['cm'],
      weightUnit: ['kg'],
    });
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);

    // Retrieve stored form data from sessionStorage if it exists
    const storedData = this.formService.getFormData('profileData');
    if (storedData) {
      // Convert the birthday string to a Date object
      if (storedData.birthday) {
        storedData.birthday = new Date(storedData.birthday);
      }
      this.form.patchValue(storedData);
    }
  }

  // Custom validator to check if the date is more than 10 years ago
  ageValidator(control: any) {
    const dateOfBirth = control.value;
    if (dateOfBirth) {
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const month = today.getMonth() - dateOfBirth.getMonth();
      if (
        month < 0 ||
        (month === 0 && today.getDate() < dateOfBirth.getDate())
      ) {
        return { minAge: true };
      }
      return age >= 10 ? null : { minAge: true };
    }
    return null;
  }

  // Method to handle form submission
  onSubmit() {
    if (this.form.valid) {
      const formData = {
        gender: this.form.value.gender,
        date_of_birth: this.form.value.birthday,
        height: this.form.value.height,
        weight: this.form.value.weight,
      };
      // Storing the personal info in sessionStorage
      this.formService.setFormData('profileData', formData);

      this.router.navigate(['/create-profile/medical-info']);
    } else {
      console.log('Form is invalid');
    }
  }

  // Update height and weight unit
  onHeightChange(unit: string) {
    this.selectedUnitHeight = unit;
    this.form.get('heightUnit')?.setValue(unit);
  }

  onWeightChange(unit: string) {
    this.selectedUnitWeight = unit;
    this.form.get('weightUnit')?.setValue(unit);
  }

  // Check if all fields are empty
  isFormEmpty(): boolean {
    const requiredFields = ['gender', 'birthday', 'height', 'weight'];
    return requiredFields.every(
      (key) =>
        this.form.get(key)?.value === null || this.form.get(key)?.value === ''
    );
  }

  clearSessionAndNavigate(): void {
    // Clear sessionStorage
    sessionStorage.clear();

    // Navigate to the medicines page
    this.router.navigate(['/create-profile/medical-info']);
  }
}
