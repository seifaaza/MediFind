// post.interface.ts (Update the id type)
export interface Post {
  id: number; // Change this from string to number if backend returns a number
  title: string;
  content: string;
  created_at: string;
  category: number;
  author_id: number;
  author_username: string;
  num_comments: number;
}
