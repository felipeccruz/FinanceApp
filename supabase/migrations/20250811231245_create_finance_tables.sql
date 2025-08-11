-- Create transactions table
CREATE TABLE public.transactions
(
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP
        WITH TIME ZONE DEFAULT timezone
        ('utc'::text, now
        ()) NOT NULL,
    updated_at TIMESTAMP
        WITH TIME ZONE DEFAULT timezone
        ('utc'::text, now
        ()) NOT NULL
);

        -- Create goals table
        CREATE TABLE public.goals
        (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
                title VARCHAR(255) NOT NULL,
                target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount > 0),
                current_amount DECIMAL(10,2) DEFAULT 0 CHECK (current_amount >= 0),
                category VARCHAR(50) NOT NULL,
                deadline DATE,
                created_at TIMESTAMP
                WITH TIME ZONE DEFAULT timezone
                ('utc'::text, now
                ()) NOT NULL,
    updated_at TIMESTAMP
                WITH TIME ZONE DEFAULT timezone
                ('utc'::text, now
                ()) NOT NULL
);

                -- Create categories table (predefined categories)
                CREATE TABLE public.categories
                (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(50) UNIQUE NOT NULL,
                        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
                        created_at TIMESTAMP
                        WITH TIME ZONE DEFAULT timezone
                        ('utc'::text, now
                        ()) NOT NULL
);

                        -- Insert default categories
                        INSERT INTO public.categories
                                (name, type)
                        VALUES
                                ('Alimentação', 'expense'),
                                ('Transporte', 'expense'),
                                ('Moradia', 'expense'),
                                ('Saúde', 'expense'),
                                ('Educação', 'expense'),
                                ('Entretenimento', 'expense'),
                                ('Roupas', 'expense'),
                                ('Salário', 'income'),
                                ('Freelance', 'income'),
                                ('Investimentos', 'both'),
                                ('Outros', 'both');

                        -- Enable Row Level Security
                        ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

                        -- Create policies for transactions
                        CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR
                        SELECT USING (auth.uid() = user_id);

                        CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR
                        INSERT WITH CHECK (auth.uid() =
                        user_id);

                        CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR
                        UPDATE USING (auth.uid()
                        = user_id);

                        CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR
                        DELETE USING (auth.uid
                        () = user_id);

                        -- Create policies for goals
                        CREATE POLICY "Users can view own goals" ON public.goals
    FOR
                        SELECT USING (auth.uid() = user_id);

                        CREATE POLICY "Users can insert own goals" ON public.goals
    FOR
                        INSERT WITH CHECK (auth.uid() =
                        user_id);

                        CREATE POLICY "Users can update own goals" ON public.goals
    FOR
                        UPDATE USING (auth.uid()
                        = user_id);

                        CREATE POLICY "Users can delete own goals" ON public.goals
    FOR
                        DELETE USING (auth.uid
                        () = user_id);

                        -- Create policy for categories (read-only for all authenticated users)
                        CREATE POLICY "Authenticated users can view categories" ON public.categories
    FOR
                        SELECT USING (auth.role() = 'authenticated');

                        -- Create indexes for better performance
                        CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
                        CREATE INDEX idx_transactions_date ON public.transactions(date);
                        CREATE INDEX idx_transactions_category ON public.transactions(category);
                        CREATE INDEX idx_goals_user_id ON public.goals(user_id);

                        -- Create function to update updated_at column
                        CREATE OR REPLACE FUNCTION update_updated_at_column
                        ()
RETURNS TRIGGER AS $$
                        BEGIN
    NEW.updated_at = timezone
                        ('utc'::text, now
                        ());
                        RETURN NEW;
                        END;
$$ language 'plpgsql';

                        -- Create triggers to automatically update updated_at
                        CREATE TRIGGER update_transactions_updated_at BEFORE
                        UPDATE ON public.transactions
    FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column
                        ();

                        CREATE TRIGGER update_goals_updated_at BEFORE
                        UPDATE ON public.goals
    FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column
                        ();
