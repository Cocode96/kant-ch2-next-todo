'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { browserClient, configured } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setError(''); setMessage('');
    try {
      const credentials = {email: String(form.get('email')).trim(), password: String(form.get('password'))};
      const client = browserClient();
      const {data, error} = signup
        ? await client.auth.signUp({...credentials, options: {emailRedirectTo: location.origin + '/auth/callback'}})
        : await client.auth.signInWithPassword(credentials);
      if (error) throw error;
      if (data.session) { router.replace('/'); router.refresh(); }
      else setMessage('확인 이메일의 링크를 연 뒤 로그인하세요.');
    } catch {setError('인증에 실패했습니다. 입력 정보와 이메일 확인, 연결 상태를 확인하세요.');}
    finally {setBusy(false);}
  }
  if (!configured()) return <main className="min-h-screen bg-slate-50 p-6"><h1>환경 설정 필요</h1><p>.env.example의 두 이름으로 별도 테스트 Supabase를 설정하세요.</p></main>;
  return <main className="min-h-screen bg-slate-50 p-6">
    <h1 className="mb-4 text-xl">{signup ? '회원가입' : '로그인'}</h1>
    <form onSubmit={submit} className="grid max-w-sm gap-4">
      <label>이메일<Input name="email" type="email" autoComplete="email" required /></label>
      <label>비밀번호<Input name="password" type="password" minLength={8} maxLength={128} autoComplete={signup ? 'new-password' : 'current-password'} required /></label>
      <Button type="submit" variant="outline" disabled={busy}>{busy ? '처리 중...' : signup ? '가입하기' : '로그인'}</Button>
      <Button type="button" variant="outline" disabled={busy} onClick={() => {setSignup(!signup); setError(''); setMessage('');}}>{signup ? '로그인으로' : '회원가입으로'}</Button>
    </form>
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
  </main>;
}

