'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Todo } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { browserClient } from '@/lib/supabase-browser';

export default function TodoDetail({todo, userId}: {todo: Todo; userId: string}) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [checked, setChecked] = useState(todo.checked);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true); setMessage(''); setError('');
    try {
      const {data, error} = await browserClient().from('shop_todos')
        .update({title: title.trim(), checked}).eq('id', todo.id).eq('user_id', userId).select('id');
      if (error || data?.length !== 1) throw new Error('update failed');
      setMessage('저장했습니다.'); router.refresh();
    } catch {setError('수정하지 못했습니다. 로그인과 연결 상태를 확인하세요.');}
    finally {setBusy(false);}
  }
  async function remove() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const {data, error} = await browserClient().from('shop_todos')
        .delete().eq('id', todo.id).eq('user_id', userId).select('id');
      if (error || data?.length !== 1) throw new Error('delete failed');
      router.replace('/'); router.refresh();
    } catch {setError('삭제하지 못했습니다.'); setBusy(false);}
  }
  return <div className="rounded border border-slate-300 bg-white p-3">
    <form onSubmit={save} className="grid max-w-md gap-4">
      <label>제목<Input value={title} onChange={e => setTitle(e.target.value)} maxLength={200} required /></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> 완료</label>
      <Button variant="outline" type="submit" disabled={busy}>수정 저장</Button>
    </form>
    <Button className="mt-4" variant="outline" disabled={busy} onClick={remove}>삭제</Button>
    {message && <p role="status">{message}</p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}

