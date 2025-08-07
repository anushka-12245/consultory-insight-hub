import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ForumPost, ForumReply, ForumUser, SortOption, ForumCategory } from '@/types/forum';
import { v4 as uuidv4 } from 'uuid';

interface ForumContextType {
  posts: ForumPost[];
  user: ForumUser | null;
  currentCategory: string;
  sortOption: SortOption;
  searchTerm: string;
  darkMode: boolean;
  createPost: (title: string, content: string, category: string, isAnonymous: boolean, customAuthor?: string) => void;
  createReply: (postId: string, content: string, isAnonymous: boolean, parentReplyId?: string, customAuthor?: string) => void;
  deletePost: (postId: string) => void;
  deleteReply: (postId: string, replyId: string) => void;
  votePost: (postId: string, voteType: 'up' | 'down') => void;
  voteReply: (postId: string, replyId: string, voteType: 'up' | 'down') => void;
  togglePostExpanded: (postId: string) => void;
  toggleReplyExpanded: (postId: string, replyId: string) => void;
  setCurrentCategory: (category: string) => void;
  setSortOption: (option: SortOption) => void;
  setSearchTerm: (term: string) => void;
  setUser: (user: ForumUser | null) => void;
  toggleDarkMode: () => void;
  categories: ForumCategory[];
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const defaultCategories: ForumCategory[] = [
  { id: 'all', name: 'All Posts', icon: 'Globe', color: 'hsl(var(--forum-accent))' },
  { id: 'strategy', name: 'Strategy', icon: 'Target', color: 'hsl(0, 70%, 50%)' },
  { id: 'case-help', name: 'Case Help', icon: 'HelpCircle', color: 'hsl(240, 70%, 50%)' },
  { id: 'random', name: 'Random', icon: 'Shuffle', color: 'hsl(120, 60%, 50%)' },
  { id: 'feedback', name: 'Feedback', icon: 'MessageSquare', color: 'hsl(60, 70%, 50%)' },
];

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'How to approach market sizing questions in consulting interviews?',
    content: 'I\'m struggling with market sizing questions. What\'s the best framework to use? Any tips from experienced consultants?',
    author: 'Aman G.',
    isAnonymous: false,
    upvotes: 15,
    downvotes: 2,
    userVote: null,
    category: 'case-help',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    replies: [
      {
        id: 'r1',
        content: 'Start with the TAM/SAM/SOM approach. Always break down the problem into manageable pieces.',
        author: 'Anonymous',
        isAnonymous: true,
        upvotes: 8,
        downvotes: 0,
        userVote: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 2 days ago + 1 hour
        postId: '1',
        replies: [],
        isExpanded: false,
      }
    ],
    isExpanded: false,
  },
  {
    id: '2',
    title: 'Best resources for practicing case studies?',
    content: 'Looking for recommendations on case study books, online platforms, and practice partners. What worked best for you?',
    author: 'Anonymous',
    isAnonymous: true,
    upvotes: 23,
    downvotes: 1,
    userVote: null,
    category: 'strategy',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000), // 2 days ago - 3 hours
    replies: [],
    isExpanded: false,
  }
];

export function ForumProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [user, setUser] = useState<ForumUser | null>({
    id: 'user1',
    name: 'Aman G.',
    isAdmin: false, // Changed to false - Aman G. is not an admin
  });
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const createPost = useCallback((title: string, content: string, category: string, isAnonymous: boolean, customAuthor?: string) => {
    const newPost: ForumPost = {
      id: uuidv4(),
      title,
      content,
      author: isAnonymous ? 'Anonymous' : (customAuthor || user?.name || 'Anonymous'),
      isAnonymous,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      category,
      createdAt: new Date(),
      replies: [],
      isExpanded: false,
    };
    setPosts(prev => [newPost, ...prev]);
  }, [user]);

  const createReply = useCallback((postId: string, content: string, isAnonymous: boolean, parentReplyId?: string, customAuthor?: string) => {
    const newReply: ForumReply = {
      id: uuidv4(),
      content,
      author: isAnonymous ? 'Anonymous' : (customAuthor || user?.name || 'Anonymous'),
      isAnonymous,
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      createdAt: new Date(),
      postId,
      parentReplyId,
      replies: [],
      isExpanded: false,
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (!parentReplyId) {
          return { ...post, replies: [...post.replies, newReply] };
        } else {
          // Add nested reply logic here if needed
          return { ...post, replies: [...post.replies, newReply] };
        }
      }
      return post;
    }));
  }, [user]);

  const deletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const deleteReply = useCallback((postId: string, replyId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, replies: post.replies.filter(reply => reply.id !== replyId) };
      }
      return post;
    }));
  }, []);

  const votePost = useCallback((postId: string, voteType: 'up' | 'down') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Handle vote logic
        if (currentVote === voteType) {
          // Removing vote
          newUserVote = null;
          if (voteType === 'up') newUpvotes--;
          else newDownvotes--;
        } else {
          // Adding or changing vote
          if (currentVote === 'up') newUpvotes--;
          else if (currentVote === 'down') newDownvotes--;
          
          if (voteType === 'up') newUpvotes++;
          else newDownvotes++;
        }

        return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
      }
      return post;
    }));
  }, []);

  const voteReply = useCallback((postId: string, replyId: string, voteType: 'up' | 'down') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(reply => {
            if (reply.id === replyId) {
              const currentVote = reply.userVote;
              let newUpvotes = reply.upvotes;
              let newDownvotes = reply.downvotes;
              let newUserVote: 'up' | 'down' | null = voteType;

              if (currentVote === voteType) {
                newUserVote = null;
                if (voteType === 'up') newUpvotes--;
                else newDownvotes--;
              } else {
                if (currentVote === 'up') newUpvotes--;
                else if (currentVote === 'down') newDownvotes--;
                
                if (voteType === 'up') newUpvotes++;
                else newDownvotes++;
              }

              return { ...reply, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
            }
            return reply;
          })
        };
      }
      return post;
    }));
  }, []);

  const togglePostExpanded = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
    ));
  }, []);

  const toggleReplyExpanded = useCallback((postId: string, replyId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: post.replies.map(reply =>
            reply.id === replyId ? { ...reply, isExpanded: !reply.isExpanded } : reply
          )
        };
      }
      return post;
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  return (
    <ForumContext.Provider value={{
      posts,
      user,
      currentCategory,
      sortOption,
      searchTerm,
      darkMode,
      createPost,
      createReply,
      deletePost,
      deleteReply,
      votePost,
      voteReply,
      togglePostExpanded,
      toggleReplyExpanded,
      setCurrentCategory,
      setSortOption,
      setSearchTerm,
      setUser,
      toggleDarkMode,
      categories: defaultCategories,
    }}>
      {children}
    </ForumContext.Provider>
  );
}

export function useForum() {
  const context = useContext(ForumContext);
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
}