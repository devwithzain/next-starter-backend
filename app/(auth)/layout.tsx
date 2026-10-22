import { cn } from "@/lib/utils";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative w-full h-screen z-0 flex items-center justify-center bg-black overflow-hidden">
			<div className="absolute flex w-full h-full items-center justify-center ">
				<div
					className={cn(
						"absolute inset-0",
						"bg-size-[20px_20px]",
						"bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
						"dark:bg-[radial-gradient(#404040_1px,transparent_1px)]",
					)}
				/>
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />
			</div>
			<div className="relative z-10 w-full max-w-lg p-6 flex flex-col items-center gap-8">
				<div className="w-full">{children}</div>
			</div>
		</div>
	);
}
