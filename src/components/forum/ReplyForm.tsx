import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForum } from '@/context/ForumContext';
import { motion } from 'framer-motion';

interface ReplyFormProps {
  postId: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function ReplyForm({ postId, onSubmit, onCancel }: ReplyFormProps) {
  const { createReply } = useForum();
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      createReply(postId, content, isAnonymous);
      setContent('');
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
        
        <div className="flex gap-2">
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
            disabled={!content.trim() || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}