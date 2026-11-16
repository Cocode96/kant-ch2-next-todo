import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Web Study Todo",
	description: "shop-practice를 보완한 회원별 Todo",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="ko">
			<body className="flex min-h-screen flex-col">
				<header className="border-b p-4">
					<nav className="flex gap-4">
						<Link href="/">홈</Link>
						<Link href="/login">로그인</Link>
					</nav>
				</header>

				<div className="flex-1">
					{children}
				</div>

				<footer className="border-t p-4">
					© Web Study
				</footer>
			</body>
		</html>
	);
}
