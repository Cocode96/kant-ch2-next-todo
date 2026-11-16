'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({reset}: {reset: () => void}) {
  return <div className="p-6"><p role="alert">데이터를 불러오지 못했습니다.</p><Button variant="outline" onClick={reset}>다시 시도</Button></div>;
}

