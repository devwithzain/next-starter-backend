"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter((item) => item !== "");

	const breadcrumbs = segments
		.filter((segment) => segment.toLowerCase() !== "user")
		.map((segment, index) => {
			const href =
				"/" +
				segments
					.slice(0, index + 1)
					.filter((s) => s.toLowerCase() !== "user")
					.join("/");

			return {
				title:
					segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
				href,
				isLast: index === segments.length - 1,
			};
		});

	return (
		<header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) rounded-t-xl">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/">Home</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumbs.length > 0 && <BreadcrumbSeparator />}
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							return (
								<React.Fragment key={item.href}>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage>{item.title}</BreadcrumbPage>
										) : (
											<BreadcrumbLink href={item.href}>
												{item.title}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>

									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
				<div className="ml-auto flex items-center gap-2">
					<Link href="/">
						<Button variant="default">
							<Home />
							<span>Visit Site</span>
						</Button>
					</Link>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
