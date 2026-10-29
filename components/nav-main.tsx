"use client";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";

export type NavItem = {
	title: string;
	url: string;
	icon?: Icon;
};

export type NavGroup = {
	group?: string;
	items: NavItem[];
};

export function NavMain({ items }: { items: NavGroup[] }) {
	const pathname = usePathname();
	return (
		<>
			{items.map((group, index) => (
				<SidebarGroup key={index}>
					{group.group && <SidebarGroupLabel>{group.group}</SidebarGroupLabel>}
					<SidebarGroupContent>
						<SidebarMenu>
							{group.items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={pathname === item.url}
										tooltip={item.title}>
										<Link
											className="flex items-center gap-2"
											href={item.url}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			))}
		</>
	);
}
