'use client';

import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import TodoItem from "./TodoItem";
import type { Todo } from "../types";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { browserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function TodoList({ userId }: { userId: string }): React.JSX.Element {
	const router = useRouter();
	const [todos, setForm] = useState<Todo[]>([]);
	const [title, setTitle] = useState('');
	const [showCheckedOnly, setShowCheckedOnly] = useState(false);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [revision, setRevision] = useState(0);

	useEffect(() => {
		let active = true;
		browserClient().from('shop_todos').select('id,title,checked')
			.eq('user_id', userId).order('created_at')
			.then(({ data, error }) => {
				if (!active) return;
				if (error) setError('목록을 불러오지 못했습니다.');
				else setForm(data ?? []);
				setLoading(false);
			}, () => { if (active) { setError('연결에 실패했습니다.'); setLoading(false); } });
		return () => { active = false; };
	}, [userId, revision]);

	const reload = () => { setError(''); setMessage(''); setLoading(true); setRevision(value => value + 1); };
	const logout = async () => {
		setBusy(true); setError('');
		try {
			const { error } = await browserClient().auth.signOut();
			if (error) throw error;
			router.replace('/login'); router.refresh();
		} catch { setError('로그아웃하지 못했습니다.'); setBusy(false); }
	};


	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedTitle = title.trim();
		if (!trimmedTitle || busy || loading) return;

		const newTodo: Todo = {
			id: crypto.randomUUID(),
			title: trimmedTitle,
			checked: false,
		};

		setBusy(true); setError(''); setMessage('');
		try {
			const { data, error } = await browserClient().from('shop_todos')
				.insert({ ...newTodo, user_id: userId }).select('id,title,checked').single();
			if (error) throw error;
			setForm(prev => [...prev, data]);
			setTitle(''); setMessage('할 일을 등록했습니다.');
		} catch { setError('등록하지 못했습니다. 로그인과 연결 상태를 확인하세요.'); }
		finally { setBusy(false); }
	};

	const onToggle = async (id: string) => {
		const current = todos.find(todo => todo.id === id);
		if (!current || busy) return;
		setBusy(true); setError(''); setMessage('');
		try {
			const { data, error } = await browserClient().from('shop_todos')
				.update({ checked: !current.checked }).eq('id', id).eq('user_id', userId)
				.select('id,title,checked').single();
			if (error) throw error;
			setForm(prev => prev.map(todo => todo.id === id ? data : todo));
			setMessage('완료 상태를 저장했습니다.');
		} catch { setError('완료 상태를 저장하지 못했습니다.'); }
		finally { setBusy(false); }
	};

	const visibleTodos = showCheckedOnly ? todos.filter(todo => todo.checked) : todos;


	return (
		<main className="min-h-screen bg-slate-50 p-6">
			<div className="mb-4 flex justify-end"><Button variant="outline" disabled={busy} onClick={logout}>로그아웃</Button></div>
			<form onSubmit={onSubmit} className="flex gap-2">
				<input
					type="text"
					name="title"
					aria-label="할 일 제목"
					value={title}
					onChange={onChange}
					maxLength={200}
					required
					className="rounded border border-slate-300 p-2 text-slate-900"
				/>

				<Button type="submit" variant="outline" size="lg" disabled={busy || loading}>
					<FaPlus aria-hidden="true" />
					할 일 등록
				</Button>

				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={() => setShowCheckedOnly(prev => !prev)}
				>
					{showCheckedOnly ? '전체 보기' : '완료 항목만 보기'}
				</Button>
			</form>

			{loading && <p role="status">불러오는 중...</p>}
			{error && <p role="alert">{error} <Button variant="outline" disabled={busy} onClick={reload}>다시 조회</Button></p>}
			{message && <p role="status">{message}</p>}
			{!loading && !error && <p role="status">{visibleTodos.length ? `할 일 ${visibleTodos.length}개` : showCheckedOnly ? '완료한 할 일이 없습니다.' : '아직 할 일이 없습니다.'}</p>}
			<ul className="mt-4 space-y-2 text-slate-900">
				{visibleTodos.map(todo => (
					<TodoItem key={todo.id} todo={todo} onToggle={onToggle} busy={busy} />
				))}
			</ul>
		</main>
	);
}