"use client";
import {
	SidebarMenu,
	SidebarGroup,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import * as React from "react";
import { Icon } from "@tabler/icons-react";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton render={<a href={item.url} />}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
