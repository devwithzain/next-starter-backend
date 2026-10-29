"use client";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	IconMail,
	IconInnerShadowTop,
	IconCirclePlusFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { sidebarData } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();
	const role = session?.user?.role || "user";

	const navItems =
		role === "admin" ? sidebarData.adminNav : sidebarData.userNav;

	return (
		<Sidebar
			collapsible="offcanvas"
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
							<Link
								href="/dashboard"
								className="flex items-center gap-2">
								<IconInnerShadowTop className="size-5!" />
								<span className="text-base font-semibold">Dashboard</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem className="flex items-center gap-2">
						<div className="flex-1">
							<SidebarMenuButton
								tooltip="Admin Dashboard"
								className="w-full bg-black text-white dark:bg-white dark:text-black duration-200 ease-linear hover:bg-black/90 active:bg-black/90">
								<IconCirclePlusFilled />
								<span>Admin Dashboard</span>
							</SidebarMenuButton>
						</div>
						<Link href="/dashboard/inquiries">
							<Button
								size="icon"
								className="size-8 group-data-[collapsible=icon]:opacity-0"
								variant="outline"
								title="Inquiries">
								<IconMail />
								<span className="sr-only">Inquiries</span>
							</Button>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				{session?.user && <NavUser user={session.user} />}
			</SidebarFooter>
		</Sidebar>
	);
}
