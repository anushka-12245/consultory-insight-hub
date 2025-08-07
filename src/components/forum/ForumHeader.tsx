import { Search, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForum } from '@/context/ForumContext';
import { motion } from 'framer-motion';

export function ForumHeader() {
  const { sortOption, setSortOption, searchTerm, setSearchTerm } = useForum();

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
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            A space for consulting aspirants to share insights, ask questions, and collaborate on case prep.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
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
        </div>
      </div>
    </motion.header>
  );
}