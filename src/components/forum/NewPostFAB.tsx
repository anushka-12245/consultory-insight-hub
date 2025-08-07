import { useState } from 'react';
import { Plus } from 'lucide-react';
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
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
      
      <NewPostModal open={open} onOpenChange={setOpen} />
    </>
  );
}