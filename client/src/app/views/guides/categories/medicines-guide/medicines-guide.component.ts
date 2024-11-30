import { Component } from '@angular/core';
import { BackComponent } from '../../../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-medicines-guide',
  standalone: true,
  imports: [BackComponent],
  templateUrl: './medicines-guide.component.html',
  styleUrl: './medicines-guide.component.css',
})
export class MedicinesGuideComponent {}
