import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private formData: any = {};

  // Method to set data
  setFormData(key: string, value: any) {
    this.formData[key] = value;
  }

  // Method to get data
  getFormData() {
    return this.formData;
  }

  // Method to clear data (optional)
  clearFormData() {
    this.formData = {};
  }

  // Method to submit data (placeholder for HTTP request)
  submitFormData() {
    console.log('Submitting form data:', this.formData);
    // Replace with HTTP request to the API
    // Example:
    // return this.http.post('your-api-endpoint', this.formData);
  }
}
