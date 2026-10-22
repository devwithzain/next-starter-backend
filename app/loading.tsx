import Image from "next/image";
import { logoImg } from "@/public";

export default function Loading() {
	return (
		<div className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-background px-4">
			<div className="relative z-10 flex flex-col items-center space-y-6 text-center">
				<div className="relative">
					<Image
						src={logoImg}
						alt="T.Auto Logo"
						width={250}
						height={250}
						className="object-cover animate-pulse"
					/>
				</div>
			</div>
		</div>
	);
}
