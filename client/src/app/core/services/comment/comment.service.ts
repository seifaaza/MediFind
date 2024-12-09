import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentPostedSource = new Subject<void>(); // Notify components when a comment is posted
  commentPosted$ = this.commentPostedSource.asObservable();

  // Method to notify components
  notifyCommentPosted() {
    this.commentPostedSource.next();
  }
}
