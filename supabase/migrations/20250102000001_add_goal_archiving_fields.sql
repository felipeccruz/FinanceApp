-- Add archived and completed_date fields to goals table
ALTER TABLE public.goals 
ADD COLUMN archived BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN completed_date DATE;

-- Create index for archived field for better performance
CREATE INDEX idx_goals_archived ON public.goals(archived);

-- Create index for completed_date
CREATE INDEX idx_goals_completed_date ON public.goals(completed_date); 