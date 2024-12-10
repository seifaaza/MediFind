import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzModalComponent, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

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
  ],
  providers: [NzModalService], // Add the provider for NzModalService
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'], // Corrected typo "styleUrl" to "styleUrls"
})
export class CreatePostComponent {
  isVisible = false;
  loading = false;
  selectedValue = null;

  constructor(
    private modal: NzModalService,
    private http: HttpClient,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
