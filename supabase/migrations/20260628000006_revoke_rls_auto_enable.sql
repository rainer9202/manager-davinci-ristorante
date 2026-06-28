-- rls_auto_enable() was created by Supabase CLI tooling and is not needed at runtime.
-- Revoke public execute access to prevent it from being called via /rest/v1/rpc.
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
