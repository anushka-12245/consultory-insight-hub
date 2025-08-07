import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForum } from '@/context/ForumContext';
import { motion } from 'framer-motion';

interface NewPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPostModal({ open, onOpenChange }: NewPostModalProps) {
  const { createPost, categories, user } = useForum();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) return;
    if (!isAnonymous && !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      // Use the entered name or 'Anonymous' if anonymous is checked
      const displayName = isAnonymous ? 'Anonymous' : authorName.trim();
      createPost(title, content, category, isAnonymous, displayName);
      
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setAuthorName(user?.name || '');
      setIsAnonymous(false);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Post</DialogTitle>
        </DialogHeader>
        
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Share your thoughts, questions, or insights..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Author Information</label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous-post"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="anonymous-post"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Post anonymously
                  </label>
                </div>
                
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Input
                      placeholder="Enter your name..."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will be displayed publicly with your post
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !title.trim() || 
                !content.trim() || 
                !category || 
                (!isAnonymous && !authorName.trim()) || 
                isSubmitting
              }
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}