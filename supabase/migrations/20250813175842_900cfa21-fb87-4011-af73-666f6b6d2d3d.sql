-- Update RLS policies to allow anonymous users

-- Posts policies: Allow everyone to view and create posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Anyone can view posts" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update posts" 
ON public.posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete posts" 
ON public.posts 
FOR DELETE 
USING (true);

-- Replies policies: Allow everyone to view and create replies
DROP POLICY IF EXISTS "Replies are viewable by everyone" ON public.replies;
DROP POLICY IF EXISTS "Users can create replies" ON public.replies;
DROP POLICY IF EXISTS "Users can update their own replies" ON public.replies;
DROP POLICY IF EXISTS "Users can delete their own replies" ON public.replies;

CREATE POLICY "Anyone can view replies" 
ON public.replies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create replies" 
ON public.replies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update replies" 
ON public.replies 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete replies" 
ON public.replies 
FOR DELETE 
USING (true);

-- Votes policies: Allow everyone to view and create votes
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON public.votes;
DROP POLICY IF EXISTS "Users can create their own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON public.votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON public.votes;

CREATE POLICY "Anyone can view votes" 
ON public.votes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create votes" 
ON public.votes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update votes" 
ON public.votes 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete votes" 
ON public.votes 
FOR DELETE 
USING (true);

-- Make user_id columns nullable to support anonymous posts
ALTER TABLE public.posts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.replies ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.votes ALTER COLUMN user_id DROP NOT NULL;