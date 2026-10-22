import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import ReactLenis from "lenis/react";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn("antialiased", poppins.className)}>
			<body>
				<Toaster />
				<ReactLenis root>{children}</ReactLenis>
			</body>
		</html>
	);
}
