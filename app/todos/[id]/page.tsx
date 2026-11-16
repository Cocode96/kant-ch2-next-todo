import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/supabase-server';
import TodoDetail from '@/app/domains/todo/component/TodoDetail';

export const dynamic = 'force-dynamic';
export default async function TodoPage({params}: {params: Promise<{id: string}>}) {
  const {supabase, user} = await requireUser();
  const {id} = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const {data, error} = await supabase.from('shop_todos')
    .select('id,title,checked').eq('id', id).eq('user_id', user.id).maybeSingle();
  if (error) throw new Error('할 일 조회 실패');
  if (!data) notFound();
  return <main className="min-h-screen bg-slate-50 p-6">
    <Link href="/" className="underline">목록으로</Link>
    <h1 className="my-4 text-xl">할 일 상세</h1>
    <TodoDetail todo={data} userId={user.id} />
  </main>;
}

