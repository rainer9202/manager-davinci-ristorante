-- Restrict write access to the specific admin email instead of any authenticated user

drop policy if exists "admin categories" on categories;
drop policy if exists "admin allergens" on allergens;
drop policy if exists "admin dishes" on dishes;
drop policy if exists "admin dish_allergens" on dish_allergens;

create policy "admin categories" on categories
  for all
  using (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site')
  with check (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site');

create policy "admin allergens" on allergens
  for all
  using (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site')
  with check (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site');

create policy "admin dishes" on dishes
  for all
  using (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site')
  with check (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site');

create policy "admin dish_allergens" on dish_allergens
  for all
  using (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site')
  with check (auth.jwt() ->> 'email' = 'seydina@lavitabouna.site');
