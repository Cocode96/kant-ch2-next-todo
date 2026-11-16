import TodoList from './domains/todo/component/TodoList';
import { requireUser } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const {user} = await requireUser();
  return <TodoList userId={user.id} />;
}

