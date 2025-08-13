import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ForumPost, ForumReply, ForumUser, SortOption, ForumCategory } from '@/types/forum';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ForumContextType {
  posts: ForumPost[];
  user: ForumUser | null;
  currentCategory: string;
  sortOption: SortOption;
  searchTerm: string;
  darkMode: boolean;
  loading: boolean;
  createPost: (title: string, content: string, category: string, isAnonymous: boolean, customAuthor?: string) => Promise<void>;
  createReply: (postId: string, content: string, isAnonymous: boolean, parentReplyId?: string, customAuthor?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteReply: (postId: string, replyId: string) => Promise<void>;
  votePost: (postId: string, voteType: 'up' | 'down') => Promise<void>;
  voteReply: (postId: string, replyId: string, voteType: 'up' | 'down') => Promise<void>;
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
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [user, setUser] = useState<ForumUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Load posts from database
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      const { data: repliesData, error: repliesError } = await supabase
        .from('replies')
        .select('*')
        .order('created_at', { ascending: false });

      if (repliesError) throw repliesError;

      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*');

      if (votesError) throw votesError;

      // Transform data to ForumPost format
      const transformedPosts: ForumPost[] = postsData.map(post => {
        const postReplies = repliesData.filter(reply => reply.post_id === post.id);
        const postVotes = votesData.filter(vote => vote.post_id === post.id);
        
        const upvotes = postVotes.filter(vote => vote.vote_type === 1).length;
        const downvotes = postVotes.filter(vote => vote.vote_type === -1).length;
        const userVote = user ? postVotes.find(vote => vote.user_id === user.id)?.vote_type === 1 ? 'up' : postVotes.find(vote => vote.user_id === user.id)?.vote_type === -1 ? 'down' : null : null;

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          author: 'User', // We'll improve this later with profiles
          isAnonymous: false,
          upvotes,
          downvotes,
          userVote,
          category: 'general',
          createdAt: new Date(post.created_at),
          replies: postReplies.map(reply => {
            const replyVotes = votesData.filter(vote => vote.reply_id === reply.id);
            const replyUpvotes = replyVotes.filter(vote => vote.vote_type === 1).length;
            const replyDownvotes = replyVotes.filter(vote => vote.vote_type === -1).length;
            const replyUserVote = user ? replyVotes.find(vote => vote.user_id === user.id)?.vote_type === 1 ? 'up' : replyVotes.find(vote => vote.user_id === user.id)?.vote_type === -1 ? 'down' : null : null;

            return {
              id: reply.id,
              content: reply.content,
              author: 'User',
              isAnonymous: false,
              upvotes: replyUpvotes,
              downvotes: replyDownvotes,
              userVote: replyUserVote,
              createdAt: new Date(reply.created_at),
              postId: reply.post_id,
              replies: [],
              isExpanded: false,
            };
          }),
          isExpanded: false,
        };
      });

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.email?.split('@')[0] || 'User',
          isAdmin: false,
        });
      }
    };
    getSession();
  }, []);

  // Load posts when user changes
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const createPost = useCallback(async (title: string, content: string, category: string, isAnonymous: boolean, customAuthor?: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Reload posts to show the new one
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }, [user, loadPosts]);

  const createReply = useCallback(async (postId: string, content: string, isAnonymous: boolean, parentReplyId?: string, customAuthor?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          post_id: postId,
          content,
          user_id: user.id,
        });

      if (error) throw error;

      // Reload posts to show the new reply
      await loadPosts();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  }, [user, loadPosts]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, [loadPosts]);

  const deleteReply = useCallback(async (postId: string, replyId: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      await loadPosts();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  }, [loadPosts]);

  const votePost = useCallback(async (postId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    try {
      const voteValue = voteType === 'up' ? 1 : -1;
      
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteValue) {
          // Remove vote
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote
          await supabase
            .from('votes')
            .update({ vote_type: voteValue })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            post_id: postId,
            vote_type: voteValue,
          });
      }

      await loadPosts();
    } catch (error) {
      console.error('Error voting on post:', error);
    }
  }, [user, loadPosts]);

  const voteReply = useCallback(async (postId: string, replyId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    try {
      const voteValue = voteType === 'up' ? 1 : -1;
      
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('reply_id', replyId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteValue) {
          // Remove vote
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote
          await supabase
            .from('votes')
            .update({ vote_type: voteValue })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            reply_id: replyId,
            vote_type: voteValue,
          });
      }

      await loadPosts();
    } catch (error) {
      console.error('Error voting on reply:', error);
    }
  }, [user, loadPosts]);

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
      loading,
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