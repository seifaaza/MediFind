import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-topics-categories-links',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, RouterModule, CommonModule],
  templateUrl: './topics-categories-links.component.html',
  styleUrls: ['./topics-categories-links.component.css'],
})
export class TopicsCategoriesLinksComponent {}
