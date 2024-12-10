import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { environment } from '../../../../../../environments/environment.prod';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-delete-comment',
  standalone: true,
  imports: [NzButtonComponent, NzIconModule, NzModalModule],
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.css'],
})
export class DeleteCommentComponent {
  @Input() commentId!: string; // Accept comment ID as an input
  @Output() commentDeleted = new EventEmitter<string>();
  apiUrl = environment.API_URL;
  isVisible = false;
  loading = false;

  constructor(
    private http: HttpClient, // Inject HttpClient
    private authService: AuthService, // Inject AuthService
    private message: NzMessageService
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
      .delete(`${this.apiUrl}/comment/${this.commentId}`, { headers })
      .subscribe({
        next: () => {
          this.isVisible = false; // Close the modal
          this.loading = false; // Hide loading icon
          this.commentDeleted.emit(this.commentId);
        },
        error: () => {
          this.loading = false; // Hide loading icon
          this.isVisible = false; // Close the modal
          this.message.create(
            'error',
            'Failed to delete this comment. Please try again!'
          );
        },
      });
  }
}
