CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  dietary text NOT NULL CHECK (dietary IN ('veg', 'non-veg')),
  image_url text NOT NULL,
  mood_tags text[] NOT NULL DEFAULT '{}',
  is_signature boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view available menu items" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_available = true);

CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 24),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  guests integer NOT NULL CHECK (guests BETWEEN 1 AND 16),
  special_request text CHECK (char_length(special_request) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can create reservations" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 100),
  customer_phone text NOT NULL CHECK (char_length(customer_phone) BETWEEN 7 AND 24),
  subtotal numeric(10,2) NOT NULL CHECK (subtotal >= 0),
  taxes numeric(10,2) NOT NULL CHECK (taxes >= 0),
  total numeric(10,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can create orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (status = 'received');

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests can create order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER menu_items_set_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reservations_set_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.menu_items (category, name, description, price, dietary, image_url, mood_tags, is_signature) VALUES
('Signature Coffee','Therapy Latte','Velvety espresso, vanilla bean and a cloud of cinnamon foam.',265,'veg','https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1200&q=85',ARRAY['boost','comfort','happiness'],true),
('Signature Coffee','Mood Booster Coffee','Double espresso, dark cocoa and orange zest.',295,'veg','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',ARRAY['boost','energy'],true),
('Cold Coffee','Salted Caramel Cloud','Cold brew, sea salt caramel and whipped cream.',285,'veg','https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','happiness'],false),
('Fresh Juices','Berry Bliss','Strawberry, blueberry, pomegranate and mint.',245,'veg','https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=85',ARRAY['fresh','happiness'],true),
('Breakfast','Garden Avocado Toast','Sourdough, smashed avocado, feta and garden herbs.',345,'veg','https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1200&q=85',ARRAY['fresh','energy'],false),
('Breakfast','Sunrise Eggs Benedict','Poached eggs, turkey ham and hollandaise on brioche.',425,'non-veg','https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=85',ARRAY['energy','slow'],false),
('Burgers & Sandwiches','Therapy Burger','Smoky grilled patty, aged cheddar and therapy sauce.',495,'non-veg','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','energy'],true),
('Burgers & Sandwiches','Forest Melt','Mushrooms, caramelised onion and smoked cheese.',395,'veg','https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','slow'],false),
('Pasta','Comfort Pasta','Rigatoni in a slow-cooked roasted tomato and parmesan sauce.',425,'veg','https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','slow'],true),
('Pizza','Wild Mushroom Pizza','Wood-fired crust, truffle cream and fresh thyme.',525,'veg','https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','slow'],false),
('Desserts','Chocolate Therapy Cake','Dark chocolate ganache, espresso crumb and sea salt.',325,'veg','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',ARRAY['comfort','happiness'],true),
('Signature Specials','Signature Loaded Fries','Crisp fries, jalapeño fondue and smoky therapy sauce.',345,'veg','https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=85',ARRAY['energy','happiness'],true);