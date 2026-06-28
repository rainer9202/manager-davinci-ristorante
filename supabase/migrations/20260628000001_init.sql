-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Allergens
create table allergens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text
);

-- Dishes
create table dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Dishes ↔ Allergens
create table dish_allergens (
  dish_id uuid references dishes(id) on delete cascade,
  allergen_id uuid references allergens(id) on delete cascade,
  primary key (dish_id, allergen_id)
);

-- RLS
alter table categories enable row level security;
alter table allergens enable row level security;
alter table dishes enable row level security;
alter table dish_allergens enable row level security;

-- Public read (frontend consumes with anon key)
create policy "public read categories" on categories for select using (true);
create policy "public read allergens" on allergens for select using (true);
create policy "public read dishes" on dishes for select using (true);
create policy "public read dish_allergens" on dish_allergens for select using (true);

-- Write only for authenticated admin
create policy "admin categories" on categories for all using (auth.role() = 'authenticated');
create policy "admin allergens" on allergens for all using (auth.role() = 'authenticated');
create policy "admin dishes" on dishes for all using (auth.role() = 'authenticated');
create policy "admin dish_allergens" on dish_allergens for all using (auth.role() = 'authenticated');
