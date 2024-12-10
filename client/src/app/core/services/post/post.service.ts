import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  category: number;
  author_id: number;
  author_username: string;
  num_comments: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  // Add new post at the beginning of the list
  addPost(post: Post): void {
    const currentPosts = this.postsSubject.getValue();
    this.postsSubject.next([post, ...currentPosts]); // Add new post to the beginning
  }

  // Set initial posts list
  setPosts(posts: Post[]): void {
    this.postsSubject.next(posts); // Set initial posts list
  }

  // Add multiple posts (useful after fetching new posts)
  addMultiplePosts(posts: Post[]): void {
    const currentPosts = this.postsSubject.getValue();
    this.postsSubject.next([...currentPosts, ...posts]); // Append new posts
  }
}
