export interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  category: string;
  createdAt: Date;
  replies: ForumReply[];
  isExpanded: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  user_id: string;
  author: string;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  createdAt: Date;
  postId: string;
  parentReplyId?: string;
  replies: ForumReply[];
  isExpanded: boolean;
}

export interface ForumUser {
  id: string;                // from `sub`
  display_name: string;      // from metadata
  email: string;
  career_interests?: string;
  college_name?: string;
  degree?: string;
  year?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  isAdmin: boolean;
}


export type SortOption = 'trending' | 'newest' | 'top';

export interface ForumCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}