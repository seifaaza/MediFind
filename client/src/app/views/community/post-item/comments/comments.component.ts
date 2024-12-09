import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { environment } from '../../../../../environments/environment.prod';
import { formatDistanceToNow, format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router'; // Import Router
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NzAvatarComponent,
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnChanges {
  @Input() postId: string | null = null;
  userId: string | null = null;
  apiUrl = environment.API_URL;
  comments: any[] = [];
  loading = true;
  placeholders: any[] = new Array(4);
  error = false;
  orderBy: string = 'latest';

  private idSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router, // Inject Router
    private message: NzMessageService // Inject NZ Message Service
  ) {}

  ngOnInit(): void {
    this.idSubscription = this.authService.getId().subscribe((id) => {
      this.userId = id;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId'] && this.postId) {
      this.fetchComments();
    }
  }

  fetchComments(): void {
    this.loading = true;
    const url = `${this.apiUrl}/comment/${this.postId}?order_by=${this.orderBy}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.comments = response.data;
        this.loading = false;
        this.comments.forEach((comment) => {
          this.checkUserReaction(comment);
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  checkUserReaction(comment: any): void {
    if (this.userId) {
      const url = `${this.apiUrl}/reaction/comment/${comment.id}`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`, // Add token for authorization
      };

      this.http.get<any>(url, { headers }).subscribe({
        next: (response) => {
          // If user has liked or disliked, update comment object
          if (response.reaction) {
            comment.isLiked = response.reaction === 'like';
            comment.isDisliked = response.reaction === 'dislike';
          }
        },
      });
    }
  }

  onLike(comment: any): void {
    if (!this.userId) {
      // Redirect to sign-in if the user is not authenticated
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    if (comment.isLiked) {
      // If the user has already liked, remove the like (call DELETE endpoint)
      const url = `${this.apiUrl}/reaction/comment/${comment.id}`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`, // Add token for authorization
      };
      this.http.delete<any>(url, { headers }).subscribe({
        next: (response) => {
          // Update the UI immediately
          comment.isLiked = false;
          comment.likes_count -= 1; // Decrease like count
        },
        error: () => {
          this.message.create(
            'error',
            'Failed to remove your like. Please try again!'
          );
        },
      });
    } else {
      // If the user has not liked, add the like (call POST endpoint)
      const url = `${this.apiUrl}/reaction/comment/${comment.id}?value=1`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`, // Add token for authorization
      };
      this.http.post<any>(url, {}, { headers }).subscribe({
        next: (response) => {
          // Update the UI immediately
          comment.isLiked = true;
          comment.likes_count += 1; // Increment like count
          if (comment.isDisliked) {
            comment.isDisliked = false;
            comment.dislikes_count -= 1; // Decrease dislike count if disliked before
          }
        },
        error: () => {
          this.message.create(
            'error',
            'Failed to like the comment. Please try again!'
          );
        },
      });
    }
  }

  onDislike(comment: any): void {
    if (!this.userId) {
      // Redirect to sign-in if the user is not authenticated
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    if (comment.isDisliked) {
      // If the user has already disliked, remove the dislike (call DELETE endpoint)
      const url = `${this.apiUrl}/reaction/comment/${comment.id}`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`, // Add token for authorization
      };
      this.http.delete<any>(url, { headers }).subscribe({
        next: (response) => {
          // Update the UI immediately
          comment.isDisliked = false;
          comment.dislikes_count -= 1; // Decrease dislike count
        },
        error: () => {
          this.message.create(
            'error',
            'Failed to remove your dislike. Please try again!'
          );
        },
      });
    } else {
      // If the user has not disliked, add the dislike (call POST endpoint)
      const url = `${this.apiUrl}/reaction/comment/${comment.id}?value=-1`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`, // Add token for authorization
      };
      this.http.post<any>(url, {}, { headers }).subscribe({
        next: (response) => {
          // Update the UI immediately
          comment.isDisliked = true;
          comment.dislikes_count += 1; // Increment dislike count
          if (comment.isLiked) {
            comment.isLiked = false;
            comment.likes_count -= 1; // Decrease like count if liked before
          }
        },
        error: () => {
          this.message.create(
            'error',
            'Failed to dislike the comment. Please try again!'
          );
        },
      });
    }
  }

  formatDate(date: string): string {
    const postDate = new Date(date);
    const distance = formatDistanceToNow(postDate, {
      addSuffix: true,
      locale: enGB,
    });

    if (distance.includes('ago')) {
      return distance;
    } else {
      return format(postDate, "'Yesterday, at' hh:mm a", { locale: enGB });
    }
  }

  // Method to handle the dropdown selection
  onOrderChange(order: string): void {
    this.orderBy = order;
    this.fetchComments(); // Fetch comments with the new order
  }

  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
  }
}
