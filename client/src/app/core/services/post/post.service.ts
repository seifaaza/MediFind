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

  // Add a new post to the beginning of the list, avoiding duplicates
  addPost(post: Post): void {
    const currentPosts = this.postsSubject.getValue();
    if (!currentPosts.find((existingPost) => existingPost.id === post.id)) {
      this.postsSubject.next([post, ...currentPosts]);
    }
  }

  // Set the initial posts list
  setPosts(posts: Post[]): void {
    const uniquePosts = this.getUniquePosts(posts);
    this.postsSubject.next(uniquePosts);
  }

  // Add multiple posts to the list, ensuring no duplicates
  addMultiplePosts(posts: Post[]): void {
    const currentPosts = this.postsSubject.getValue();
    const allPosts = [...currentPosts, ...posts];
    const uniquePosts = this.getUniquePosts(allPosts);
    this.postsSubject.next(uniquePosts);
  }

  // Helper method to filter unique posts by ID
  private getUniquePosts(posts: Post[]): Post[] {
    const uniquePostsMap = new Map<number, Post>();
    posts.forEach((post) => uniquePostsMap.set(post.id, post));
    return Array.from(uniquePostsMap.values());
  }
}
