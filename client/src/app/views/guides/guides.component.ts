import { Component } from '@angular/core';
import { GuidesCategoriesComponent } from './guides-categories/guides-categories.component';
import { GuidesHeaderComponent } from './guides-header/guides-header.component';

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [GuidesHeaderComponent, GuidesCategoriesComponent],
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css',
})
export class GuidesComponent {}
