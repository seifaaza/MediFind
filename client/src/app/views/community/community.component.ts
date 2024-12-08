import { Component } from '@angular/core';
import { CreatePostComponent } from './create-post/create-post.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CreatePostComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent {}
