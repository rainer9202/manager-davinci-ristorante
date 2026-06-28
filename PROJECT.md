# Manager Davinci Ristorante

## Propósito

Backoffice de administración del menú del restaurante Davinci. Los datos se almacenan en Supabase y son consumidos directamente por el frontend del restaurante (proyecto separado).

## Usuarios

- Un único usuario: el dueño/admin del restaurante.
- Login con email y contraseña via Supabase Auth.
- Sin roles ni permisos adicionales.
- Todas las rutas del manager requieren sesión activa (middleware de Next.js).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Base de datos | Supabase (Postgres) |
| Auth | Supabase Auth |
| UI | shadcn/ui + Tailwind CSS |
| Idioma | Español |
| Deploy | Dokploy (Docker) |

## Entidades

### Categorías
- `id`
- `nombre`
- `created_at`

### Alérgenos
- `id`
- `nombre`
- `icono` (emoji o slug)
- Seed inicial: los 14 alérgenos de la normativa europea
- Editables por el admin (nombre e icono)

### Platos
- `id`
- `nombre`
- `descripcion`
- `precio` (IVA incluido)
- `categoria_id` (FK → categorías)
- `activo` (boolean — toggle visible/oculto en el front)
- `created_at`
- Relación N:M con alérgenos

## Funcionalidades

### Categorías
- [ ] Listar categorías
- [ ] Crear categoría
- [ ] Editar categoría
- [ ] Eliminar categoría (solo si no tiene platos asignados)

### Alérgenos
- [ ] Listar alérgenos
- [ ] Editar nombre e icono de un alérgeno
- [ ] Crear alérgeno personalizado
- [ ] Eliminar alérgeno personalizado

### Platos
- [ ] Listar platos (con filtro por categoría y por estado activo/inactivo)
- [ ] Crear plato (nombre, descripción, precio con IVA, categoría, alérgenos)
- [ ] Editar plato
- [ ] Eliminar plato
- [ ] Toggle activo/inactivo por plato

## Reglas de negocio

- El precio de cada plato ya incluye IVA; el front lo muestra tal cual.
- Un plato inactivo no se elimina, solo deja de aparecer en el front.
- Los 14 alérgenos EU se insertan como seed; el admin puede editarlos o añadir nuevos.
- Las categorías sin platos pueden eliminarse; con platos asignados, no.
- Sin imágenes, sin variantes, sin historial de cambios, sin orden manual.

## Esquema de base de datos (Supabase)

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table allergens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text
);

create table dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  active boolean default true,
  created_at timestamptz default now()
);

create table dish_allergens (
  dish_id uuid references dishes(id) on delete cascade,
  allergen_id uuid references allergens(id) on delete cascade,
  primary key (dish_id, allergen_id)
);
```

## Seed — 14 alérgenos EU

| # | Nombre | Icono |
|---|---|---|
| 1 | Gluten | 🌾 |
| 2 | Crustáceos | 🦐 |
| 3 | Huevo | 🥚 |
| 4 | Pescado | 🐟 |
| 5 | Cacahuetes | 🥜 |
| 6 | Soja | 🫘 |
| 7 | Lácteos | 🥛 |
| 8 | Frutos de cáscara | 🌰 |
| 9 | Apio | 🥬 |
| 10 | Mostaza | 🟡 |
| 11 | Sésamo | 🌿 |
| 12 | Dióxido de azufre | 🍷 |
| 13 | Altramuces | 🌸 |
| 14 | Moluscos | 🦑 |

## Seguridad y RLS (Row Level Security)

Las tablas públicas (`platos`, `categorias`, `alergenos`, `platos_alergenos`) son de **lectura pública** con la `anon key` — el frontend del restaurante las consume sin autenticación.

La escritura, edición y borrado en todas las tablas requieren usuario autenticado (admin).

Políticas RLS:
- `SELECT` → permitido para todos (anon)
- `INSERT`, `UPDATE`, `DELETE` → solo `auth.role() = 'authenticated'`

El usuario admin se crea manualmente desde el panel de Supabase. No hay registro desde el manager ni recuperación de contraseña.

## Próximos pasos

1. Configurar proyecto en Supabase y obtener keys
2. Añadir variables de entorno (`.env.local`)
3. Instalar Supabase client y shadcn/ui
4. Crear migraciones y seed de alérgenos
5. Implementar login con Supabase Auth
6. Implementar CRUD de categorías
7. Implementar CRUD de alérgenos
8. Implementar CRUD de platos
