import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForum } from '@/context/ForumContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ReplyFormProps {
  postId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function ReplyForm({ postId, onSubmit, onCancel }: ReplyFormProps) {
  const { createReply, user } = useForum();
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!isAnonymous && !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      // Use the entered name or 'Anonymous' if anonymous is checked
      const displayName = isAnonymous ? 'Anonymous' : authorName.trim();
      await createReply(postId, content, isAnonymous, undefined, displayName);
      setContent('');
      setAuthorName(user?.name || '');
      setIsAnonymous(false);
      onSubmit?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border"
      onSubmit={handleSubmit}
    >
      <Textarea
        placeholder="Write your reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none"
        disabled={isSubmitting}
      />
      
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous-reply"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="anonymous-reply"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Post anonymously
            </label>
          </div>
          
          <AnimatePresence>
            {!isAnonymous && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <Input
                  placeholder="Enter your name..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isSubmitting}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This name will be displayed with your reply
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-2 ml-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={
              !content.trim() || 
              (!isAnonymous && !authorName.trim()) || 
              isSubmitting
            }
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}