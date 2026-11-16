import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function serverClient() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try { values.forEach(({name, value, options}) => jar.set(name, value, options)); }
        catch { /* Server Component의 세션 갱신은 proxy에서 처리한다. */ }
      },
    }},
  );
}
export async function requireUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect('/login');
  const supabase = await serverClient();
  const {data, error} = await supabase.auth.getUser();
  if (error || !data.user) redirect('/login');
  return {supabase, user: data.user};
}

