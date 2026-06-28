-- Insert 10 sample categories
insert into categories (name) values
  ('Antipasti'),
  ('Primi Piatti'),
  ('Secondi Piatti'),
  ('Contorni'),
  ('Pizzas'),
  ('Ensaladas'),
  ('Sopas'),
  ('Postres'),
  ('Bebidas'),
  ('Especiales del día');

-- Insert 10 sample dishes
with cats as (
  select id, name from categories
)
insert into dishes (name, description, price, category_id, active)
values
  (
    'Bruschetta al Pomodoro',
    'Pan tostado con tomate fresco, albahaca y aceite de oliva virgen extra',
    7.50,
    (select id from cats where name = 'Antipasti'),
    true
  ),
  (
    'Tabla de Embutidos',
    'Selección de embutidos italianos: mortadella, prosciutto crudo y salame',
    14.00,
    (select id from cats where name = 'Antipasti'),
    true
  ),
  (
    'Spaghetti Carbonara',
    'Pasta con huevo, guanciale crujiente, pecorino romano y pimienta negra',
    13.50,
    (select id from cats where name = 'Primi Piatti'),
    true
  ),
  (
    'Tagliatelle al Ragù',
    'Pasta fresca con ragù de ternera y cerdo cocido a fuego lento',
    14.00,
    (select id from cats where name = 'Primi Piatti'),
    true
  ),
  (
    'Risotto ai Funghi Porcini',
    'Arroz cremoso con setas porcini, mantequilla y parmigiano reggiano',
    15.50,
    (select id from cats where name = 'Primi Piatti'),
    true
  ),
  (
    'Pollo alla Parmigiana',
    'Pechuga de pollo empanada con salsa de tomate y mozzarella gratinada',
    16.00,
    (select id from cats where name = 'Secondi Piatti'),
    true
  ),
  (
    'Salmone alla Griglia',
    'Lomo de salmón a la plancha con limón, alcaparras y hierbas frescas',
    18.50,
    (select id from cats where name = 'Secondi Piatti'),
    true
  ),
  (
    'Pizza Margherita',
    'Tomate, mozzarella fior di latte y albahaca fresca',
    11.00,
    (select id from cats where name = 'Pizzas'),
    true
  ),
  (
    'Tiramisù della Casa',
    'Postre clásico italiano con mascarpone, bizcochos, café y cacao',
    6.50,
    (select id from cats where name = 'Postres'),
    true
  ),
  (
    'Panna Cotta ai Frutti di Bosco',
    'Panna cotta artesanal con coulis de frutos del bosque',
    6.00,
    (select id from cats where name = 'Postres'),
    true
  );

-- Link allergens to dishes
with
  dishes_ref as (select id, name from dishes),
  allergens_ref as (select id, name from allergens)
insert into dish_allergens (dish_id, allergen_id)
select d.id, a.id
from (values
  -- Bruschetta: Gluten
  ('Bruschetta al Pomodoro', 'Gluten'),
  -- Tabla de Embutidos: nothing (plain meat)
  -- Spaghetti Carbonara: Gluten, Huevo, Lácteos
  ('Spaghetti Carbonara', 'Gluten'),
  ('Spaghetti Carbonara', 'Huevo'),
  ('Spaghetti Carbonara', 'Lácteos'),
  -- Tagliatelle al Ragù: Gluten, Huevo
  ('Tagliatelle al Ragù', 'Gluten'),
  ('Tagliatelle al Ragù', 'Huevo'),
  -- Risotto ai Funghi Porcini: Lácteos
  ('Risotto ai Funghi Porcini', 'Lácteos'),
  -- Pollo alla Parmigiana: Gluten, Huevo, Lácteos
  ('Pollo alla Parmigiana', 'Gluten'),
  ('Pollo alla Parmigiana', 'Huevo'),
  ('Pollo alla Parmigiana', 'Lácteos'),
  -- Salmone alla Griglia: Pescado
  ('Salmone alla Griglia', 'Pescado'),
  -- Pizza Margherita: Gluten, Lácteos
  ('Pizza Margherita', 'Gluten'),
  ('Pizza Margherita', 'Lácteos'),
  -- Tiramisù: Gluten, Huevo, Lácteos
  ('Tiramisù della Casa', 'Gluten'),
  ('Tiramisù della Casa', 'Huevo'),
  ('Tiramisù della Casa', 'Lácteos'),
  -- Panna Cotta: Lácteos
  ('Panna Cotta ai Frutti di Bosco', 'Lácteos')
) as pairs(dish_name, allergen_name)
join dishes_ref d on d.name = pairs.dish_name
join allergens_ref a on a.name = pairs.allergen_name;
