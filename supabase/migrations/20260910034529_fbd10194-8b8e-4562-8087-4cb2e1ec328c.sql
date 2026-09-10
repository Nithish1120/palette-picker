CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text CHECK (char_length(full_name) <= 120),
  phone text CHECK (char_length(phone) <= 24),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Guests can create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Guests can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ADD COLUMN user_id uuid;
ALTER TABLE public.reservations ADD COLUMN user_id uuid;
CREATE POLICY "Guests can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Guests can view own reservations" ON public.reservations FOR SELECT TO authenticated USING (auth.uid() = user_id);
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.reservations TO authenticated;