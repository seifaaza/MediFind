import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private formDataKey: string = 'profileData'; // key to store in sessionStorage

  setFormData(key: string, data: any) {
    // Store form data in sessionStorage
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getFormData(key: string) {
    // Retrieve form data from sessionStorage
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }
}
