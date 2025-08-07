import { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewPostModal } from './NewPostModal';
import { motion } from 'framer-motion';

export function NewPostFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          New Post
        </Button>
      </motion.div>
      
      <NewPostModal open={open} onOpenChange={setOpen} />
    </>
  );
}