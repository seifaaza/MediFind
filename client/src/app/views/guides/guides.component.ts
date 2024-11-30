import { Component } from '@angular/core';
import { GuidesCategoriesLinksComponent } from './guides-categories-links/guides-categories-links.component';
import { GuidesHeaderComponent } from './guides-header/guides-header.component';

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [GuidesHeaderComponent, GuidesCategoriesLinksComponent],
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css',
})
export class GuidesComponent {}
