import BlogForm from "../_components/blog-form";

export const metadata = {
	title: "Create Blog | Dashboard",
	description: "Create and publish a new blog article",
};

export default function CreateBlogPage() {
	return <BlogForm mode="create" />;
}
