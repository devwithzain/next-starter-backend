"use client";
import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-background px-4">
			<div className="absolute -top-40 -left-40 w-96 h-96 bg-destructive/15 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 w-96 h-96 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
			<div className="relative z-10 max-w-xl w-full text-center space-y-8">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive mb-2 shadow-inner">
					<AlertTriangle className="w-8 h-8" />
				</div>

				<div className="space-y-3">
					<h1 className="font-outfit font-black text-4xl sm:text-5xl tracking-tight text-foreground">
						Something went wrong!
					</h1>
					<p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
						An unexpected error has occurred. We have been notified and are
						working to fix the issue.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<button
						onClick={() => reset()}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-medium text-sm transition-all shadow-lg shadow-primary/25">
						<RotateCcw className="w-4 h-4" />
						Try again
					</button>

					<Link
						href="/"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground font-medium text-sm transition-all shadow-sm">
						<Home className="w-4 h-4" />
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
