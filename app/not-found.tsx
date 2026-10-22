"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-background px-4">
			<div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative z-10 max-w-xl w-full text-center space-y-8">
				<div className="space-y-3">
					<h1 className="font-outfit font-black text-8xl sm:text-9xl tracking-tight text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/40 select-none">
						404
					</h1>
					<div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
						Page Not Found
					</div>
				</div>
				<p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
					Oops! The page you are looking for might have been removed, had its
					name changed, or is temporarily unavailable.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<button
						onClick={() => window.history.back()}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground font-medium text-sm transition-all shadow-sm">
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</button>
					<Link
						href="/"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-medium text-sm transition-all shadow-lg shadow-primary/25">
						<Home className="w-4 h-4" />
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
