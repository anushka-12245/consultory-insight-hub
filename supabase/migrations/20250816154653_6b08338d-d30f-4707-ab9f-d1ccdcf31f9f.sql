-- Add category column to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'random';

-- Update existing posts to have proper categories based on content
UPDATE public.posts 
SET category = CASE 
  WHEN content LIKE '%case%' OR title LIKE '%case%' OR title LIKE '%Case Comp%' THEN 'case-comp'
  WHEN content LIKE '%strategy%' OR title LIKE '%strategy%' THEN 'strategy'
  WHEN content LIKE '%feedback%' OR title LIKE '%feedback%' THEN 'feedback'
  WHEN content LIKE '%research%' OR title LIKE '%research%' THEN 'strategy'
  WHEN content LIKE '%consulting%' OR title LIKE '%consulting%' THEN 'strategy'
  ELSE 'random'
END;