import { db } from "@/drizzle/db";
import { desc } from "drizzle-orm";
import BlogsTable from "./_components/blogs-table";
import { blogsTable, BlogRecord } from "@/drizzle/schema";

export default async function BlogsDashboardPage() {
	let blogs: BlogRecord[] = [];

	try {
		blogs = await db
			.select()
			.from(blogsTable)
			.orderBy(desc(blogsTable.createdAt));
	} catch (err) {
		console.error("Failed to load blogs for dashboard:", err);
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-col px-4 lg:px-6 py-4 md:py-6">
				<h1 className="text-3xl text-black dark:text-white font-medium leading-tight">
					All Blogs ({blogs.length})
				</h1>
				<p className="text-base font-normal text-muted-foreground leading-tight">
					Manage and publish articles, property insights, and market updates.
				</p>
			</div>
			<BlogsTable data={blogs} />
		</div>
	);
}
