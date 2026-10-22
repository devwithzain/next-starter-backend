"use client";
import {
	IconLogout,
	IconUserCircle,
	IconDotsVertical,
} from "@tabler/icons-react";
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
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./action-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavUser({
	user,
}: {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
}) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const { refetch } = authClient.useSession();
	return (
		<SidebarMenu>
			<SidebarMenuItem className="w-full">
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={user?.image || undefined}
								alt={user?.name || ""}
							/>
							<AvatarFallback className="text-xm bg-primary/5">
								{user?.name?.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user?.name}</span>
							<span className="truncate font-medium text-xs">
								{user?.email}
							</span>
						</div>
						<IconDotsVertical className="ml-auto size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user?.image || undefined}
											alt={user?.name || ""}
										/>
										<AvatarFallback className="text-xm bg-primary/5">
											{user?.name?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user?.name}</span>
										<span className="text-muted-foreground truncate text-xs">
											{user?.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href="/dashboard/settings">
								<DropdownMenuItem>
									<IconUserCircle />
									Account
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<BetterAuthActionButton
							className="w-full outline-0 border-none block"
							variant="outline"
							action={() =>
								authClient.signOut(undefined, {
									onSuccess() {
										refetch();
										router.refresh();
									},
								})
							}>
							<IconLogout />
							Log out
						</BetterAuthActionButton>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
