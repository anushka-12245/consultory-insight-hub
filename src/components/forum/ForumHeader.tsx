import { useState } from 'react';
import { Search, TrendingUp, Clock, Award, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForum } from '@/context/ForumContext';
import { motion } from 'framer-motion';
import { NewPostModal } from './NewPostModal';

export function ForumHeader() {
  const { sortOption, setSortOption, searchTerm, setSearchTerm } = useForum();
  const [open, setOpen] = useState(false);
  const { user } = useForum();

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'top', label: 'Top Rated', icon: Award },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4"
    >
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col text-center">
          <h1 className="lg:text-3xl font-bold text-foreground mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            A space for consulting aspirants to share insights, ask questions, and collaborate on case prep.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-right justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <div className='flex flex-row justify-between gap-2'>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* new post */}
            <Button
              onClick={() => setOpen(true)}
              size="lg"
              className="h-10 px-4 bg-background hover:bg-background border"
            >
              <Edit3 className="h-5 w-5 mr-2" />
              New Post
            </Button>
            <NewPostModal open={open} onOpenChange={setOpen} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}