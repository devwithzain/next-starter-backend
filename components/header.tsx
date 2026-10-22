"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	IconLayoutDashboard,
	IconList,
	IconCar,
	IconTool,
	IconUserCheck,
	IconSettings,
	IconLogout,
	IconUser,
	IconChevronDown,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { logoImg } from "@/public";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = usePathname();
	const router = useRouter();
	const { data: session, isPending, refetch } = authClient.useSession();
	const user = session?.user;

	const isActive = (path: string) => location === path;

	const activeClass = "text-[#e30613] border-b-2 border-[#e30613] pb-1";
	const inactiveClass = "text-gray-800 hover:text-[#e30613] transition";

	const mobileActiveClass = "px-6 py-3 border-b text-[#e30613] bg-gray-50";
	const mobileInactiveClass =
		"px-6 py-3 border-b text-gray-800 hover:text-[#e30613]";

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success("Logged out successfully");
					refetch();
					router.push("/");
					router.refresh();
				},
			},
		});
	};

	return (
		<header className="bg-white text-black py-2 px-20 flex items-center justify-between shadow-md relative z-30">
			<div className="flex items-center">
				<Link href="/">
					<Image
						src={logoImg}
						alt="T.Auto Logo"
						width={100}
						height={100}
						className="object-cover"
					/>
				</Link>
			</div>
			<div className="flex items-center space-x-4">
				<nav className="hidden md:flex items-center space-x-4 font-semibold text-sm tracking-tight uppercase">
					<Link
						href="/"
						className={isActive("/") ? activeClass : inactiveClass}>
						Home
					</Link>
					<Link
						href="/book-a-service"
						className={
							isActive("/book-a-service") ? activeClass : inactiveClass
						}>
						Book a Service
					</Link>
					<Link
						href="/services"
						className={isActive("/services") ? activeClass : inactiveClass}>
						Services
					</Link>
					<Link
						href="/pricing"
						className={isActive("/pricing") ? activeClass : inactiveClass}>
						Pricing
					</Link>
					<Link
						href="/contact"
						className={isActive("/contact") ? activeClass : inactiveClass}>
						Contact Us
					</Link>
				</nav>
				<div>
					<Link
						href="/book-a-service"
						className="bg-[#e30613] hover:bg-red-700 text-white font-bold py-2 px-3 sm:py-2.5 sm:px-5 rounded-md text-[11px] sm:text-xs md:text-sm transition tracking-wider inline-block uppercase whitespace-nowrap">
						Book A Service
					</Link>
				</div>
				{user && (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<button
									type="button"
									className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#e30613]"
									aria-label="User profile menu"
								/>
							}>
							<Avatar className="h-8 w-8 rounded-full border border-red-500/20">
								<AvatarImage
									src={user?.image ?? undefined}
									alt={user?.name || "User"}
								/>
								<AvatarFallback className="font-bold text-xs">
									{user?.name ? user.name.slice(0, 2).toUpperCase() : "TA"}
								</AvatarFallback>
							</Avatar>
							<span className="hidden lg:inline-block font-semibold text-xs max-w-22 truncate">
								{user?.name?.split(" ")[0]}
							</span>
							<IconChevronDown className="size-3.5 text-gray-500" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							sideOffset={6}
							className="w-60 rounded-xl p-1.5 shadow-xl">
							<DropdownMenuGroup>
								<DropdownMenuLabel className="p-2 font-normal">
									<div className="flex items-center gap-2.5">
										<Avatar className="h-9 w-9 rounded-full border">
											<AvatarImage
												src={user?.image ?? undefined}
												alt={user?.name || "User"}
											/>
											<AvatarFallback className="bg-red-50 text-[#e30613] font-bold text-xs">
												{user?.name
													? user.name.slice(0, 2).toUpperCase()
													: "TA"}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left leading-tight">
											<span className="truncate font-semibold text-sm text-foreground">
												{user?.name}
											</span>
											<span className="truncate text-xs text-muted-foreground">
												{user?.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									render={<Link href="/dashboard" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconLayoutDashboard className="size-4 text-[#e30613]" />
									Dashboard Overview
								</DropdownMenuItem>
								<DropdownMenuItem
									render={<Link href="/dashboard/bookings" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconList className="size-4 text-blue-600" />
									Service Bookings
								</DropdownMenuItem>
								<DropdownMenuItem
									render={<Link href="/dashboard/vehicles" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconCar className="size-4 text-emerald-600" />
									Vehicle Fleet
								</DropdownMenuItem>
								<DropdownMenuItem
									render={<Link href="/dashboard/services" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconTool className="size-4 text-amber-600" />
									Service Catalog
								</DropdownMenuItem>
								<DropdownMenuItem
									render={<Link href="/dashboard/mechanics" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconUserCheck className="size-4 text-purple-600" />
									Mobile Mechanics
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem
									render={<Link href="/dashboard/settings" />}
									className="gap-2.5 font-medium cursor-pointer">
									<IconSettings className="size-4 text-gray-600" />
									Account Settings
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								className="gap-2.5 font-medium cursor-pointer text-destructive focus:text-destructive"
								onClick={handleLogout}>
								<IconLogout className="size-4" />
								Log Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="block md:hidden text-gray-800 focus:outline-none p-1.5">
					<svg
						className="w-6 h-6 sm:w-7 sm:h-7"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
			<div
				className={`absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col font-bold text-sm overflow-hidden transition-all duration-300 ease-in-out z-40 ${isMobileMenuOpen ? "max-h-[500px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}`}>
				<Link
					href="/"
					onClick={() => setIsMobileMenuOpen(false)}
					className={isActive("/") ? mobileActiveClass : mobileInactiveClass}>
					Home
				</Link>
				<Link
					href="/book-a-service"
					onClick={() => setIsMobileMenuOpen(false)}
					className={
						isActive("/book-a-service")
							? mobileActiveClass
							: mobileInactiveClass
					}>
					Book a Service
				</Link>
				<Link
					href="/services"
					onClick={() => setIsMobileMenuOpen(false)}
					className={
						isActive("/services") ? mobileActiveClass : mobileInactiveClass
					}>
					Services
				</Link>
				<Link
					href="/pricing"
					onClick={() => setIsMobileMenuOpen(false)}
					className={
						isActive("/pricing") ? mobileActiveClass : mobileInactiveClass
					}>
					Pricing
				</Link>
				<Link
					href="/contact"
					onClick={() => setIsMobileMenuOpen(false)}
					className={
						isActive("/contact") ? mobileActiveClass : mobileInactiveClass
					}>
					Contact Us
				</Link>

				{user ? (
					<div className="border-t border-gray-200 bg-gray-50/70 p-4 flex flex-col gap-2">
						<div className="flex items-center gap-2.5 pb-2 border-b border-gray-200">
							<Avatar className="h-8 w-8 rounded-full border">
								<AvatarImage
									src={user?.image ?? undefined}
									alt={user?.name || "User"}
								/>
								<AvatarFallback className="bg-red-50 text-[#e30613] font-bold text-xs">
									{user?.name ? user.name.slice(0, 2).toUpperCase() : "TA"}
								</AvatarFallback>
							</Avatar>
							<div className="grid leading-tight">
								<span className="text-xs font-semibold text-gray-900">
									{user?.name}
								</span>
								<span className="text-[11px] text-gray-500 font-normal">
									{user?.email}
								</span>
							</div>
						</div>
						<Link
							href="/dashboard"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center gap-2 text-gray-800 hover:text-[#e30613] py-1.5 text-xs uppercase font-bold">
							<IconLayoutDashboard className="size-4 text-[#e30613]" />
							Go to Dashboard
						</Link>
						<Link
							href="/dashboard/bookings"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center gap-2 text-gray-800 hover:text-[#e30613] py-1.5 text-xs uppercase font-bold">
							<IconList className="size-4 text-blue-600" />
							My Bookings
						</Link>
						<Link
							href="/dashboard/settings"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center gap-2 text-gray-800 hover:text-[#e30613] py-1.5 text-xs uppercase font-bold">
							<IconSettings className="size-4 text-gray-600" />
							Account Settings
						</Link>
						<button
							onClick={() => {
								setIsMobileMenuOpen(false);
								handleLogout();
							}}
							className="flex items-center gap-2 text-red-600 hover:text-red-700 py-1.5 text-xs uppercase font-bold text-left">
							<IconLogout className="size-4" />
							Log Out
						</button>
					</div>
				) : (
					<div className="border-t border-gray-200 p-4">
						<Link
							href="/sign-in"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-2.5 rounded-md text-xs uppercase hover:bg-gray-800 transition">
							<IconUser className="size-4" />
							Sign In / Account
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
