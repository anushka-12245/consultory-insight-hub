import { useMemo } from 'react';
import { PostCard } from './PostCard';
import { useForum } from '@/context/ForumContext';
import { motion, AnimatePresence } from 'framer-motion';

export function ForumFeed() {
  const { posts, currentCategory, sortOption, searchTerm } = useForum();

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(post => post.category === currentCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(lowercaseSearch) ||
        post.content.toLowerCase().includes(lowercaseSearch) ||
        post.author.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'top':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'trending':
        default:
          // Simple trending algorithm: score + recency
          const scoreA = (a.upvotes - a.downvotes) + (a.replies.length * 2);
          const scoreB = (b.upvotes - b.downvotes) + (b.replies.length * 2);
          const recencyA = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60); // hours
          const recencyB = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60); // hours
          const trendingA = scoreA / Math.max(1, recencyA / 24); // daily decay
          const trendingB = scoreB / Math.max(1, recencyB / 24);
          return trendingB - trendingA;
      }
    });

    return sorted;
  }, [posts, currentCategory, sortOption, searchTerm]);

  if (filteredAndSortedPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-muted-foreground">
          {searchTerm ? (
            <div>
              <p className="text-lg mb-2">No posts found for "{searchTerm}"</p>
              <p>Try adjusting your search terms or browse different categories.</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2">No posts in this category yet</p>
              <p>Be the first to start a discussion!</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {filteredAndSortedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </AnimatePresence>
    </div>
  );
}