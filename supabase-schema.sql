-- Create the josaa_cutoffs table
CREATE TABLE IF NOT EXISTS public.josaa_cutoffs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    institute TEXT NOT NULL,
    program TEXT NOT NULL,
    quota TEXT NOT NULL,
    category TEXT NOT NULL,
    gender_pool TEXT NOT NULL,
    year INTEGER NOT NULL,
    opening_rank INTEGER,
    closing_rank INTEGER,
    UNIQUE(institute, program, quota, category, gender_pool, year)
);

-- Allow public read access to josaa_cutoffs
ALTER TABLE public.josaa_cutoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.josaa_cutoffs FOR SELECT TO public USING (true);


-- Create the todos table (used in your page.tsx test)
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL
);

-- Allow public read access to todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.todos FOR SELECT TO public USING (true);

-- Insert some dummy data for the todos table so you see something on localhost:3000
INSERT INTO public.todos (name) VALUES 
('Setup Supabase'), 
('Import JoSAA Data'), 
('Build JEEPredict App!');
