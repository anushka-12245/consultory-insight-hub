import { useState } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, Trash2, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForum } from '@/context/ForumContext';
import { ForumPost } from '@/types/forum';
import { ReplyCard } from './ReplyCard';
import { ReplyForm } from './ReplyForm';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: ForumPost;
}

export function PostCard({ post }: PostCardProps) {
  const { user, votePost, deletePost, togglePostExpanded, categories } = useForum();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const canDelete = user && (user.isAdmin || (!post.isAnonymous && user.name === post.author));
  const category = categories.find(c => c.id === post.category);
  const score = post.upvotes - post.downvotes;

  const handleVote = async (voteType: 'up' | 'down') => {
    await votePost(post.id, voteType);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4"
    >
      <Card className="forum-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {post.isAnonymous ? <UserX className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  <span>Posted by: {post.author}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
              <p className="text-muted-foreground">{post.content}</p>
            </div>
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {/* Voting */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('up')}
                className={`vote-button ${post.userVote === 'up' ? 'upvoted' : ''}`}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className={`text-sm font-medium min-w-[2rem] text-center ${
                score > 0 ? 'text-forum-upvote' : score < 0 ? 'text-forum-downvote' : 'text-forum-neutral'
              }`}>
                {score}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('down')}
                className={`vote-button ${post.userVote === 'down' ? 'downvoted' : ''}`}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply
              </Button>
              
              {post.replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePostExpanded(post.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {post.isExpanded ? 'Hide' : 'Show'} {post.replies.length} replies
                </Button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <ReplyForm
                  postId={post.id}
                  onCancel={() => setShowReplyForm(false)}
                  onSubmit={() => setShowReplyForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          <AnimatePresence>
            {post.isExpanded && post.replies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 thread-line"
              >
                {post.replies.map((reply) => (
                  <ReplyCard key={reply.id} reply={reply} postId={post.id} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}