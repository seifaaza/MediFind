import { Component } from '@angular/core';
import { AboutComponent } from './components/about/about.component';
import { FeaturesComponent } from './components/features/features.component';
import { BackComponent } from '../../core/components/buttons/back/back.component';

@Component({
  selector: 'app-learn-more',
  standalone: true,
  imports: [AboutComponent, FeaturesComponent, BackComponent],
  templateUrl: './learn-more.component.html',
  styleUrl: './learn-more.component.css',
})
export class LearnMoreComponent {}
