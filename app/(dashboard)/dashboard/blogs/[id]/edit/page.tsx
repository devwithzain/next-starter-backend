import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { notFound } from "next/navigation";
import { blogsTable } from "@/drizzle/schema";
import BlogForm from "../../_components/blog-form";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Edit Blog | Dashboard",
	description: "Edit article content and publishing settings",
};

export default async function EditBlogPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [blog] = await db
		.select()
		.from(blogsTable)
		.where(eq(blogsTable.id, id))
		.limit(1);

	if (!blog) {
		notFound();
	}

	return (
		<BlogForm
			mode="edit"
			initialData={blog}
		/>
	);
}
