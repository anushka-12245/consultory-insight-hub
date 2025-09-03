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
        className="bottom-6 right-6"
      >
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="h-12 px-6 bg-background hover:bg-background"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          New Post
        </Button>
      </motion.div>
      
      <NewPostModal open={open} onOpenChange={setOpen} />
    </>
  );
}