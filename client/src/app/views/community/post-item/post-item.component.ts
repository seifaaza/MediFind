import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BackComponent } from '../../../core/components/buttons/back/back.component';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { environment } from '../../../../environments/environment.prod';
import { formatDistanceToNow, format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { CommentsComponent } from './comments/comments.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [
    BackComponent,
    CommonModule,
    NzIconModule,
    NzAvatarComponent,
    NzInputModule,
    NzButtonModule,
    CommentsComponent,
    FormsModule,
  ],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
})
export class PostItemComponent implements OnInit {
  apiUrl = environment.API_URL;
  isAuthenticated = false;
  id: string | null = null;
  loading = true; // Loading state
  postData: any = null; // Post data

  inputText: string = ''; // Two-way binding property
  maxLength: number = 350; // Maximum character limit
  isTooLong: boolean = false;
  posting = false;
  newComment: any = null;

  private usernameSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  onInputChange(): void {
    this.isTooLong = this.inputText.length > this.maxLength;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetchPostData(this.id);
    }
    this.usernameSubscription = this.authService
      .getUsername()
      .subscribe((username) => {
        this.isAuthenticated = !!username;
      });
  }

  fetchPostData(id: string): void {
    this.http.get(`${this.apiUrl}/post/${id}`).subscribe({
      next: (data) => {
        this.postData = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.router.navigate(['/community']); // Redirect to the 404 page
        } else {
          this.router.navigate(['/server-error']); // Redirect to the server error page
        }
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

  postComment(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth/sign-in']);
      return;
    }
    const body = { content: this.inputText };
    this.posting = true;

    if (this.id) {
      const url = `${this.apiUrl}/comment/${this.id}`;
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`,
      };

      this.http.post(url, body, { headers }).subscribe({
        next: (response) => {
          this.newComment = response;
          this.inputText = '';
          this.posting = false;
          this.cdr.detectChanges(); // Manually trigger change detection
        },
        error: () => {
          this.posting = false;
          this.message.create('error', 'An error occurred. Please try again!');
        },
      });
    } else {
      this.message.create('error', 'Failed to post your comment.');
    }
  }

  updateCommentList(newComment: any): void {
    // Directly update the comments list in the CommentsComponent
    if (this.postData) {
      this.postData.comments.unshift(newComment); // Add new comment at the top (or adjust based on desired order)
    }
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }
}
