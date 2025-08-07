import { Globe, Target, HelpCircle, Shuffle, MessageSquare, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForum } from '@/context/ForumContext';
import { motion } from 'framer-motion';

const iconMap = {
  Globe,
  Target,
  HelpCircle,
  Shuffle,
  MessageSquare,
};

export function ForumSidebar() {
  const { categories, currentCategory, setCurrentCategory, darkMode, toggleDarkMode } = useForum();

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border p-4"
    >
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-sidebar-foreground">Appearance</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Categories</h3>
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            const isActive = currentCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{category.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Forum Info */}
        <div className="pt-6 border-t border-sidebar-border">
          <div className="space-y-2 text-xs text-sidebar-foreground/70">
            <p>Consultory Forum</p>
            <p>Professional community for consulting aspirants</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}