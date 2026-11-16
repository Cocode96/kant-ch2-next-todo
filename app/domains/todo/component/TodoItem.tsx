import type { Todo } from "../types";
import { Check } from "lucide-react";
import Link from "next/link";

type TodoItemProps = {
    todo: Todo;
    onToggle: (id: string) => void;
    busy?: boolean;
}

export default function TodoItem(props: TodoItemProps) {
    return (
        <li className="rounded border border-slate-300 bg-white p-3">

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label={`${props.todo.title} 완료`}
                        aria-pressed={props.todo.checked}
                        disabled={props.busy}
                        onClick={() => props.onToggle(props.todo.id)}
                        className="rounded border border-slate-300 p-1"
                    >
                        <Check
                            aria-hidden="true"
                            className={
                                props.todo.checked
                                    ? 'size-5 text-green-600'
                                    : 'size-5 text-slate-300'
                            }
                        />
                    </button>

                    <Link href={`/todos/${props.todo.id}`} className={props.todo.checked ? 'line-through' : ''}>
                        {props.todo.title}
                    </Link>
                </div>
            </div>
        </li>
    );
}