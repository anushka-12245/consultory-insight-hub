import { useState } from 'react';
import { Globe, Target, HelpCircle, Trophy, Shuffle, MessageSquare, Sun, Moon, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForum } from '@/context/ForumContext';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  Globe,
  Target,
  HelpCircle,
  Trophy,
  Shuffle,
  MessageSquare,
};

export function ForumSidebar() {
  const { categories, currentCategory, setCurrentCategory, darkMode, toggleDarkMode } = useForum();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? 0 : 256
      }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-sidebar border-r border-sidebar-border relative"
    >
      {/* Collapse Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="relative -right-2 top-20 z-50 h-6 w-6 bg-sidebar border border-sidebar-border shadow-md hover:bg-sidebar-accent"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-4 mt-20">
        {/* Categories */}
        <div className="space-y-2">
          {!isCollapsed && <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Categories</h3>}
          {!isCollapsed && categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            const isActive = currentCategory === category.id;

            return (
              <motion.button
                key={category.id}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentCategory(category.id);
                  setIsCollapsed(true);
                }}
                title={isCollapsed ? category.name : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {category.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        
      </div>

      <div className='p-4 mt-auto'>
        {/* Forum Info */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 border-t border-sidebar-border"
            >
              <div className="space-y-2 text-xs text-sidebar-foreground/70">
                <p>Consultory Forum</p>
                <p>Professional community for consulting aspirants</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </motion.aside>
  );
}