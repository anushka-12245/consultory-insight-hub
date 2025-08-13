import { ChevronUp, ChevronDown, Trash2, User, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useForum } from '@/context/ForumContext';
import { ForumReply } from '@/types/forum';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ReplyCardProps {
  reply: ForumReply;
  postId: string;
}

export function ReplyCard({ reply, postId }: ReplyCardProps) {
  const { user, voteReply, deleteReply } = useForum();

  const canDelete = user && (user.isAdmin || (!reply.isAnonymous && user.name === reply.author));
  const score = reply.upvotes - reply.downvotes;

  const handleVote = async (voteType: 'up' | 'down') => {
    await voteReply(postId, reply.id, voteType);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this reply?')) {
      await deleteReply(postId, reply.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="mb-3"
    >
      <Card className="forum-surface border">
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {reply.isAnonymous ? <UserX className="h-3 w-3" /> : <User className="h-3 w-3" />}
              <span>{reply.author}</span>
              <span>•</span>
              <span>{formatDistanceToNow(reply.createdAt, { addSuffix: true })}</span>
            </div>
            
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>

          <p className="text-sm text-foreground mb-3">{reply.content}</p>

          {/* Voting */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('up')}
              className={`vote-button h-6 w-6 p-0 ${reply.userVote === 'up' ? 'upvoted' : ''}`}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <span className={`text-xs font-medium min-w-[1.5rem] text-center ${
              score > 0 ? 'text-forum-upvote' : score < 0 ? 'text-forum-downvote' : 'text-forum-neutral'
            }`}>
              {score}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('down')}
              className={`vote-button h-6 w-6 p-0 ${reply.userVote === 'down' ? 'downvoted' : ''}`}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}