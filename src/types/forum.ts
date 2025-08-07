export interface ForumPost {
  id: string;
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
  id: string;
  name: string;
  isAdmin: boolean;
}

export type SortOption = 'trending' | 'newest' | 'top';

export interface ForumCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}