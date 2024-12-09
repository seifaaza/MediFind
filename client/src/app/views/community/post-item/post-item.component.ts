import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
})
export class PostItemComponent implements OnInit {
  apiUrl = environment.API_URL;
  id: string | null = null;
  loading = true; // Loading state
  postData: any = null; // Post data

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetchPostData(this.id);
    }
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
}
