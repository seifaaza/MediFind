import { Component } from '@angular/core';

import { TopicsHeaderComponent } from './topics-header/topics-header.component';
import { TopicsCategoriesLinksComponent } from './topics-categories-links/topics-categories-links.component';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [TopicsHeaderComponent, TopicsCategoriesLinksComponent],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.css',
})
export class TopicsComponent {}
