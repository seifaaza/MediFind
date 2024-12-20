import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDistanceToNow, format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { EmptyDataComponent } from '../../core/errors/empty-data/empty-data.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { PostsService } from '../../core/services/post/post.service';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

// Define Post interface
export interface Post {
  id: number; // if the backend returns a number
  author_username: string;
  created_at: string;
  title: string;
  content: string;
  num_comments: number;
  author_id: number;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    CreatePostComponent,
    NzAvatarComponent,
    NzIconModule,
    EmptyDataComponent,
    RouterModule,
    DeletePostComponent,
  ],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  apiUrl = environment.API_URL;
  userId: string | null = null;

  posts: Post[] = [];
  isLoading = false; // Flag to track if posts are being loaded
  isAllPostsLoaded = false; // Flag to check if all posts are loaded
  placeholders: { height: string }[] = new Array(10).fill({}).map(() => ({
    height: `${Math.floor(Math.random() * (24 - 10)) + 16}rem`,
  }));
  skip = 0;
  limit = 10;

  private idSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private postsService: PostsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idSubscription = this.authService.getId().subscribe((id) => {
      this.userId = id;
    });
    // Subscribe to the posts observable
    this.postsService.posts$.subscribe((posts) => {
      this.posts = posts;
    });

    this.fetchPosts(); // Initial fetch of posts
  }

  // Listen for scroll events to detect when to load more data
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 100;

    if (
      scrollPosition >= threshold &&
      !this.isLoading &&
      !this.isAllPostsLoaded
    ) {
      // User is near the bottom, fetch more posts
      this.fetchPosts();
    }
  }

  fetchPosts(): void {
    if (this.isLoading || this.isAllPostsLoaded) return;
    this.isLoading = true; // Set isLoading to true to show skeleton loader

    this.http
      .get<any>(`${this.apiUrl}/post?limit=${this.limit}&skip=${this.skip}`)
      .subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.isAllPostsLoaded = true; // No more posts to load
          } else {
            this.postsService.addMultiplePosts(response.data); // Append new posts
            this.skip += this.limit; // Update skip for next request
          }
          this.isLoading = false; // Set isLoading to false when posts are loaded
        },
        error: (err) => {
          this.isLoading = false; // Set isLoading to false if there is an error
          this.router.navigate(['/server-error']);
        },
      });
  }

  formatDate(date: string): string {
    const postDate = new Date(date);
    const distance = formatDistanceToNow(postDate, {
      addSuffix: true,
      locale: enGB,
    });

    if (distance.includes('ago')) {
      return distance; // Show "2 days ago", etc.
    } else {
      return format(postDate, "'Yesterday, at' hh:mm a", { locale: enGB }); // Format like "Yesterday, at 7:10 PM"
    }
  }

  // Handle the delete post button click and prevent navigation
  onStopEvent(event: MouseEvent): void {
    event.preventDefault(); // Prevent the default behavior (navigation)
    event.stopPropagation(); // Stop the event from propagating (to prevent triggering routerLink)
  }

  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
  }

  onPostDeleted(postId: number): void {
    this.posts = this.posts.filter((post) => post.id !== postId);
    this.cdr.detectChanges(); // Trigger change detection manually
  }
}
