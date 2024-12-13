import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PostsService } from '../../../core/services/post/post.service';

@Component({
  selector: 'app-delete-post',
  standalone: true,
  imports: [NzButtonComponent, NzIconModule, NzModalModule],
  templateUrl: './delete-post.component.html',
  styleUrl: './delete-post.component.css',
})
export class DeletePostComponent {
  @Input() postId!: number;
  @Output() postDeleted = new EventEmitter<number>();
  apiUrl = environment.API_URL;
  isVisible = false;
  loading = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private message: NzMessageService,
    private postsService: PostsService
  ) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.loading = true;

    const token = this.authService.getToken(); // Get the current token from AuthService
    const headers = { Authorization: `Bearer ${token}` }; // Set the authorization header

    // Make the API call to delete the comment
    this.http
      .delete(`${this.apiUrl}/post/${this.postId}`, { headers })
      .subscribe({
        next: () => {
          this.postsService.removePost(this.postId); // Remove the post from service
          this.postDeleted.emit(this.postId); // Notify parent component

          this.isVisible = false; // Close the modal
          this.loading = false; // Hide loading icon
          this.postDeleted.emit(this.postId);
        },
        error: () => {
          this.loading = false; // Hide loading icon
          this.isVisible = false; // Close the modal
          this.message.create(
            'error',
            'Failed to delete this post. Please try again!'
          );
        },
      });
  }
}
