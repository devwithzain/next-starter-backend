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
import * as React from "react";
import { sidebarData } from "@/constants";
import { CommandIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavDocuments } from "@/components/nav-documents";
import { NavSecondary } from "@/components/nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();
	return (
		<Sidebar
			collapsible="offcanvas"
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="data-[slot=sidebar-menu-button]:p-1.5!"
							render={<a href="#" />}>
							<CommandIcon className="size-5!" />
							<span className="text-base font-semibold">Dashboard</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={sidebarData.navMain} />
				<NavDocuments items={sidebarData.quickLinks} />
				<NavSecondary
					items={sidebarData.navSecondary}
					className="mt-auto"
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={session?.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
