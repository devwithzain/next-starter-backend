"use client";
import {
	IconArrowLeft,
	IconClock,
	IconDeviceFloppy,
	IconLoader2,
	IconPhoto,
	IconRefresh,
	IconSend,
	IconTrash,
	IconUpload,
	IconWorld,
} from "@tabler/icons-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BlogRecord } from "@/drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorX } from "@/components/editor-x";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogFormProps {
	mode: "create" | "edit";
	initialData?: BlogRecord;
}

const CATEGORIES = [
	"Market Insights",
	"Property News",
	"Buying Guide",
	"Renting Guide",
	"Investment",
	"Area Guides",
	"Company News",
];

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function calculateReadTime(text: string): string {
	const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.ceil(wordCount / 200));
	return `${minutes} min read`;
}

export default function BlogForm({ mode, initialData }: BlogFormProps) {
	const router = useRouter();

	const [title, setTitle] = React.useState(initialData?.title || "");
	const [slug, setSlug] = React.useState(initialData?.slug || "");
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(
		mode === "edit",
	);
	const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
	const [content, setContent] = React.useState(initialData?.content || "");
	const [coverImage, setCoverImage] = React.useState(
		initialData?.coverImage || "",
	);
	const [category, setCategory] = React.useState(
		initialData?.category || "Market Insights",
	);
	const [author, setAuthor] = React.useState(
		initialData?.author || "Barrain London",
	);
	const [readTime, setReadTime] = React.useState(
		initialData?.readTime || "3 min read",
	);
	const [status, setStatus] = React.useState<
		"draft" | "published" | "archived"
	>(initialData?.status || "draft");
	const [featured, setFeatured] = React.useState(
		initialData?.featured || false,
	);

	const [isSaving, setIsSaving] = React.useState(false);
	const [isUploading, setIsUploading] = React.useState(false);
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		if (!isSlugManuallyEdited) {
			setSlug(slugify(newTitle));
		}
	};

	const handleContentChange = React.useCallback((newMarkdown: string) => {
		setContent(newMarkdown);
		setReadTime(calculateReadTime(newMarkdown));
	}, []);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image file must be under 2MB");
			return;
		}

		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		try {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("image", file);

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to upload image");
			}

			setCoverImage(data.url);
			toast.success("Cover image uploaded successfully!");
		} catch (error: any) {
			console.error("Upload error:", error);
			toast.error(error.message || "Failed to upload cover image");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleSubmit = async (targetStatus?: "draft" | "published") => {
		if (!title.trim()) {
			toast.error("Please provide a title for the blog");
			return;
		}

		const finalStatus = targetStatus || status;

		try {
			setIsSaving(true);

			const payload = {
				title: title.trim(),
				slug: slug.trim() || slugify(title),
				excerpt: excerpt.trim(),
				content,
				coverImage: coverImage.trim() || null,
				category,
				author: author.trim() || "Barrain London",
				readTime,
				status: finalStatus,
				featured,
			};

			const endpoint =
				mode === "edit" ? `/api/blogs/${initialData?.id}` : "/api/blogs";

			const res = await fetch(endpoint, {
				method: mode === "edit" ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to save blog");
			}

			toast.success(
				mode === "edit"
					? "Blog updated successfully!"
					: finalStatus === "published"
						? "Blog published successfully!"
						: "Draft saved successfully!",
			);

			router.push("/dashboard/blogs");
			router.refresh();
		} catch (error: any) {
			console.error("Save error:", error);
			toast.error(error.message || "Something went wrong saving the blog");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!initialData?.id) return;
		try {
			setIsDeleting(true);
			const res = await fetch(`/api/blogs/${initialData.id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to delete blog");
			}
			toast.success("Blog deleted successfully");
			router.push("/dashboard/blogs");
			router.refresh();
		} catch (error: any) {
			console.error("Delete error:", error);
			toast.error(error.message || "Failed to delete blog");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground pb-20">
			{/* Top Header */}
			<div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 lg:px-8 py-3.5 backdrop-blur-md">
				<div className="flex items-center gap-3">
					<Link
						href="/dashboard/blogs"
						className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
						<IconArrowLeft className="size-4" />
						Back to Blogs
					</Link>
					<div className="hidden sm:flex items-center gap-2">
						<span className="text-sm font-semibold">
							{mode === "edit" ? "Edit Article" : "Create New Article"}
						</span>
						<Badge
							variant={
								status === "published"
									? "default"
									: status === "draft"
										? "secondary"
										: "outline"
							}
							className="text-[11px] capitalize">
							{status}
						</Badge>
					</div>
				</div>

				<div className="flex items-center gap-2.5">
					<Button
						variant="outline"
						size="sm"
						disabled={isSaving}
						onClick={() => handleSubmit("draft")}
						className="gap-1.5 text-xs">
						<IconDeviceFloppy className="size-4" />
						Save Draft
					</Button>

					<Button
						size="sm"
						disabled={isSaving}
						onClick={() => handleSubmit("published")}
						className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
						{isSaving ? (
							<IconLoader2 className="size-4 animate-spin" />
						) : (
							<IconSend className="size-4" />
						)}
						{mode === "edit" && status === "published"
							? "Update Article"
							: "Publish"}
					</Button>
				</div>
			</div>

			{/* Main Workspace */}
			<div className="mx-auto w-full px-4 lg:px-8 py-6">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Left Column: Editor & Main Fields (8 cols) */}
					<div className="space-y-6 lg:col-span-8">
						{/* Title Input */}
						<div className="space-y-2">
							<Input
								type="text"
								value={title}
								onChange={handleTitleChange}
								placeholder="Article Title..."
								className="h-auto border-none bg-transparent px-0 py-2 text-2xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0 sm:text-3xl md:text-4xl"
							/>
						</div>

						{/* URL Slug Preview & Edit */}
						<div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs">
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<IconWorld className="size-3.5" />
								<Label className="text-xs font-medium text-muted-foreground">
									URL Slug:
								</Label>
							</div>
							<span className="text-muted-foreground/70">/blogs/</span>
							<Input
								type="text"
								value={slug}
								onChange={(e) => {
									setIsSlugManuallyEdited(true);
									setSlug(slugify(e.target.value));
								}}
								placeholder="my-article-slug"
								className="h-7 flex-1 min-w-[150px] border-none bg-transparent font-mono text-xs shadow-none focus-visible:ring-0"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								onClick={() => {
									setIsSlugManuallyEdited(false);
									setSlug(slugify(title));
									toast.info("Slug regenerated from title");
								}}
								title="Reset slug from title"
								className="text-muted-foreground hover:text-foreground">
								<IconRefresh className="size-3.5" />
							</Button>
						</div>

						{/* Excerpt / Summary */}
						<div className="space-y-2">
							<Label
								htmlFor="blog-excerpt"
								className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Excerpt / Meta Description
							</Label>
							<Textarea
								id="blog-excerpt"
								value={excerpt}
								onChange={(e) => setExcerpt(e.target.value)}
								rows={2}
								placeholder="Provide a brief summary of the article for social sharing and search engines..."
								className="resize-none"
							/>
						</div>

						{/* Rich Text Editor X */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Article Content (Rich Text Editor)
								</Label>
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<IconClock className="size-3.5" />
									<span>{readTime}</span>
								</div>
							</div>

							<div className="rounded-xl border border-input shadow-xs">
								<EditorX
									initialContent={initialData?.content || ""}
									onChange={handleContentChange}
									className="min-h-[550px]"
								/>
							</div>
						</div>
					</div>

					{/* Right Column: Metadata, Cover & Publishing Settings (4 cols) */}
					<div className="space-y-6 lg:col-span-4">
						{/* Cover Image Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-semibold">
									Cover Image
								</CardTitle>
								{coverImage && (
									<button
										type="button"
										onClick={() => setCoverImage("")}
										className="text-xs text-destructive hover:underline">
										Remove
									</button>
								)}
							</CardHeader>
							<CardContent>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileUpload}
									className="hidden"
								/>

								{coverImage ? (
									<div className="space-y-3">
										<div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
											<Image
												src={coverImage}
												alt="Cover image preview"
												fill
												className="object-cover"
												unoptimized
											/>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => fileInputRef.current?.click()}
											disabled={isUploading}
											className="w-full gap-2 text-xs">
											{isUploading ? (
												<IconLoader2 className="size-4 animate-spin" />
											) : (
												<IconPhoto className="size-4" />
											)}
											Replace Cover Image
										</Button>
									</div>
								) : (
									<div
										onClick={() => fileInputRef.current?.click()}
										className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 p-6 text-center cursor-pointer transition hover:border-primary/50 hover:bg-muted/40">
										<div className="mb-2 rounded-full bg-muted p-2.5 text-muted-foreground group-hover:text-primary">
											{isUploading ? (
												<IconLoader2 className="size-5 animate-spin" />
											) : (
												<IconUpload className="size-5" />
											)}
										</div>
										<p className="text-xs font-medium text-foreground">
											Click to upload image
										</p>
										<p className="mt-1 text-[11px] text-muted-foreground">
											PNG, JPG, WebP up to 2MB
										</p>
									</div>
								)}

								<div className="mt-3 space-y-1.5">
									<Label
										htmlFor="cover-image-url"
										className="text-[11px] text-muted-foreground">
										Or paste image URL:
									</Label>
									<Input
										id="cover-image-url"
										type="url"
										value={coverImage}
										onChange={(e) => setCoverImage(e.target.value)}
										placeholder="https://images.unsplash.com/..."
										className="h-8 text-xs"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Publishing Options Card */}
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-semibold">
									Publishing Options
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Status Select */}
								<div className="space-y-1.5">
									<Label
										htmlFor="blog-status"
										className="text-xs font-medium text-muted-foreground">
										Status
									</Label>
									<Select
										value={status}
										onValueChange={(val) => {
											if (val)
												setStatus(val as "draft" | "published" | "archived");
										}}>
										<SelectTrigger
											id="blog-status"
											className="w-full">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="draft">Draft (Private)</SelectItem>
											<SelectItem value="published">
												Published (Public)
											</SelectItem>
											<SelectItem value="archived">Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Category Select */}
								<div className="space-y-1.5">
									<Label
										htmlFor="blog-category"
										className="text-xs font-medium text-muted-foreground">
										Category
									</Label>
									<Select
										value={category}
										onValueChange={(val) => {
											if (val) setCategory(val);
										}}>
										<SelectTrigger
											id="blog-category"
											className="w-full">
											<SelectValue placeholder="Select category" />
										</SelectTrigger>
										<SelectContent>
											{CATEGORIES.map((cat) => (
												<SelectItem
													key={cat}
													value={cat}>
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Author Name */}
								<div className="space-y-1.5">
									<Label
										htmlFor="blog-author"
										className="text-xs font-medium text-muted-foreground">
										Author Name
									</Label>
									<Input
										id="blog-author"
										type="text"
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
										placeholder="e.g. Barrain London, Steven..."
									/>
								</div>

								{/* Read Time */}
								<div className="space-y-1.5">
									<Label
										htmlFor="blog-read-time"
										className="text-xs font-medium text-muted-foreground">
										Estimated Read Time
									</Label>
									<Input
										id="blog-read-time"
										type="text"
										value={readTime}
										onChange={(e) => setReadTime(e.target.value)}
										placeholder="e.g. 4 min read"
									/>
								</div>

								{/* Featured Post Checkbox */}
								<div className="flex items-center justify-between pt-2 border-t border-border">
									<div className="space-y-0.5">
										<Label
											htmlFor="blog-featured"
											className="text-xs font-medium text-foreground cursor-pointer">
											Featured Post
										</Label>
										<p className="text-[11px] text-muted-foreground">
											Highlight this article on the top banner
										</p>
									</div>
									<Checkbox
										id="blog-featured"
										checked={featured}
										onCheckedChange={(checked) => setFeatured(!!checked)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Danger Zone (Edit mode only) */}
						{mode === "edit" && (
							<div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-xs">
								<h4 className="text-xs font-semibold uppercase tracking-wider text-destructive">
									Danger Zone
								</h4>
								<p className="mt-1 text-xs text-muted-foreground">
									Deleting this blog will remove it permanently from the
									database.
								</p>

								{showDeleteConfirm ? (
									<div className="mt-3 space-y-2">
										<p className="text-xs font-medium text-destructive">
											Are you completely sure?
										</p>
										<div className="flex items-center gap-2">
											<Button
												size="xs"
												variant="destructive"
												disabled={isDeleting}
												onClick={handleDelete}
												className="gap-1 text-xs">
												{isDeleting ? (
													<IconLoader2 className="size-3.5 animate-spin" />
												) : (
													<IconTrash className="size-3.5" />
												)}
												Confirm Delete
											</Button>
											<Button
												size="xs"
												variant="outline"
												disabled={isDeleting}
												onClick={() => setShowDeleteConfirm(false)}
												className="text-xs">
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => setShowDeleteConfirm(true)}
										className="mt-3 w-full gap-1.5 text-xs">
										<IconTrash className="size-4" />
										Delete Blog
									</Button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
