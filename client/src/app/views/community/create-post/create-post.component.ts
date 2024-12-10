import { Component, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzModalComponent, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { environment } from '../../../../environments/environment.prod';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconModule,
    NzModalComponent,
    CommonModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    NzDropDownModule,
  ],
  providers: [NzModalService],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  apiUrl = environment.API_URL;
  isAuthenticated = false;
  isVisible = false;
  loading = false;

  // Form Fields
  title = '';
  content = '';
  selectedCategory: { id: number; name: string } | null = null;

  categories: { id: number; name: string }[] = [];

  private usernameSubscription: Subscription | null = null;

  constructor(
    private modal: NzModalService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.usernameSubscription = this.authService
      .getUsername()
      .subscribe((username) => {
        this.isAuthenticated = !!username;
      });
  }

  showModal(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth/sign-in']);
    } else {
      this.isVisible = true;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  fetchCategories(): void {
    this.http
      .get<{ id: number; name: string }[]>(
        `${this.apiUrl}/initial-data/categories`
      )
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: () => {
          this.message.error('Failed to load categories data');
        },
      });
  }

  isFormValid(): boolean {
    return (
      this.title.trim() !== '' &&
      this.content.trim() !== '' &&
      this.selectedCategory !== null
    );
  }

  selectCategory(category: { id: number; name: string }): void {
    this.selectedCategory = category;
  }

  createPost(): void {
    if (!this.selectedCategory) {
      this.message.error('Please select a category.');
      return;
    }

    this.loading = true;
    const token = this.authService.getToken(); // Retrieve the token from AuthService

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const postData = {
      title: this.title,
      content: this.content,
      category_id: this.selectedCategory.id, // This is safe now because we checked if selectedCategory is not null
    };

    this.http.post(`${this.apiUrl}/post`, postData, { headers }).subscribe({
      next: () => {
        this.message.success('Post created successfully!');
        this.isVisible = false;
        this.resetForm();
      },
      error: () => {
        this.message.error('Failed to create post');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.selectedCategory = null;
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }
}
