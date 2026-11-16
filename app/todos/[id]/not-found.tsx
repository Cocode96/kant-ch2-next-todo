import Link from 'next/link';
export default function Missing() {
  return <div className="p-6"><p>할 일이 없거나 접근할 수 없습니다.</p><Link href="/" className="underline">목록으로</Link></div>;
}

