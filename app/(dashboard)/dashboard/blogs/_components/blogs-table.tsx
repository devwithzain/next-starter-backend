"use client";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconDotsVertical,
	IconGripVertical,
	IconLayoutColumns,
	IconSearch,
	IconPlus,
	IconPencil,
	IconTrash,
	IconExternalLink,
	IconEye,
	IconBook,
	IconCalendar,
} from "@tabler/icons-react";
import {
	columnFilteringFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	FlexRender,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
	type ColumnFiltersState,
	type ColumnVisibilityState,
	type Row,
	type SortingState,
} from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { BlogRecord } from "@/drizzle/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DragHandle({ id }: { id: string }) {
	const { attributes, listeners } = useSortable({ id });

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing">
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}

function StatusBadge({ status }: { status: string }) {
	const s = status.toLowerCase();
	if (s === "published") {
		return (
			<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 capitalize">
				Published
			</Badge>
		);
	}
	if (s === "draft") {
		return (
			<Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25 capitalize">
				Draft
			</Badge>
		);
	}
	return (
		<Badge
			variant="secondary"
			className="capitalize">
			Archived
		</Badge>
	);
}

function BlogActions({
	blog,
	onDelete,
}: {
	blog: BlogRecord;
	onDelete: (id: string) => void;
}) {
	const router = useRouter();

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
							size="icon"
						/>
					}>
					<IconDotsVertical className="size-4" />
					<span className="sr-only">Open menu</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-44">
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/blogs/${blog.id}/edit`)}>
						<IconPencil className="mr-2 size-4 text-muted-foreground" />
						Edit Blog
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => window.open(`/blogs/${blog.slug}`, "_blank")}>
						<IconExternalLink className="mr-2 size-4 text-muted-foreground" />
						Preview Post
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger
						render={
							<DropdownMenuItem variant="destructive">
								<IconTrash className="mr-2 size-4" />
								Delete
							</DropdownMenuItem>
						}
					/>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete &ldquo;{blog.title}&rdquo;? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onDelete(blog.id)}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Delete Post
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, BlogRecord>();

function createColumns(onDelete: (id: string) => void) {
	return columnHelper.columns([
		columnHelper.display({
			id: "drag",
			header: () => null,
			cell: ({ row }) => <DragHandle id={row.original.id} />,
			enableHiding: false,
		}),
		columnHelper.display({
			id: "select",
			header: ({ table }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						indeterminate={
							table.getIsSomePageRowsSelected() &&
							!table.getIsAllPageRowsSelected()
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		}),
		columnHelper.accessor("title", {
			id: "blog",
			header: "Article",
			cell: ({ row }) => {
				const b = row.original;
				return (
					<div className="flex items-center gap-3 py-1">
						{b.coverImage ? (
							<div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
								<Image
									src={b.coverImage}
									alt={b.title}
									fill
									className="object-cover"
									sizes="48px"
								/>
							</div>
						) : (
							<div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
								<IconBook className="size-5" />
							</div>
						)}
						<div className="flex flex-col min-w-0">
							<Link
								href={`/dashboard/blogs/${b.id}/edit`}
								className="font-medium truncate hover:underline hover:text-brand transition text-sm">
								{b.title}
							</Link>
							<span className="text-xs text-muted-foreground truncate font-mono">
								/{b.slug}
							</span>
						</div>
					</div>
				);
			},
			enableHiding: false,
		}),
		columnHelper.accessor("category", {
			header: "Category",
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className="text-xs whitespace-nowrap">
					{row.original.category}
				</Badge>
			),
		}),
		columnHelper.accessor("status", {
			header: "Status",
			cell: ({ row }) => <StatusBadge status={row.original.status} />,
		}),
		columnHelper.accessor("author", {
			header: "Author",
			cell: ({ row }) => (
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					{row.original.author}
				</span>
			),
		}),
		columnHelper.accessor("readTime", {
			header: "Read Time",
			cell: ({ row }) => (
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					{row.original.readTime || "—"}
				</span>
			),
		}),
		columnHelper.accessor("createdAt", {
			header: "Created",
			cell: ({ row }) => {
				const d = new Date(row.original.createdAt);
				return (
					<span className="text-xs text-muted-foreground whitespace-nowrap">
						{d.toLocaleDateString("en-GB", {
							day: "2-digit",
							month: "short",
							year: "numeric",
						})}
					</span>
				);
			},
		}),
		columnHelper.display({
			id: "actions",
			cell: ({ row }) => (
				<BlogActions
					blog={row.original}
					onDelete={onDelete}
				/>
			),
		}),
	]);
}

function DraggableRow({ row }: { row: Row<typeof features, BlogRecord> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					<FlexRender cell={cell} />
				</TableCell>
			))}
		</TableRow>
	);
}

export default function BlogsTable({
	data: initialData,
}: {
	data: BlogRecord[];
}) {
	const router = useRouter();
	const [data, setData] = React.useState(() => initialData);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<ColumnVisibilityState>({
			author: true,
			readTime: true,
		});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [activeTab, setActiveTab] = React.useState("all");

	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const handleDelete = async (id: string) => {
		try {
			const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
			const result = await res.json();
			if (result.success) {
				toast.success("Blog post deleted");
				setData((prev) => prev.filter((b) => b.id !== id));
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete blog");
			}
		} catch (err: any) {
			toast.error(err.message || "Failed to delete");
		}
	};

	const filteredData = React.useMemo(() => {
		return data.filter((b) => {
			if (activeTab === "published") return b.status === "published";
			if (activeTab === "draft") return b.status === "draft";
			if (activeTab === "archived") return b.status === "archived";
			return true;
		});
	}, [data, activeTab]);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => filteredData?.map(({ id }) => id) || [],
		[filteredData],
	);

	const columns = React.useMemo(() => createColumns(handleDelete), []);

	const table = useTable({
		features,
		data: filteredData,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
			globalFilter,
		},
		globalFilterFn: (
			row: Row<typeof features, BlogRecord>,
			columnId: string,
			value: string,
		) => {
			const b = row.original;
			const searchValue = value.toLowerCase();
			return (
				(b.title || "").toLowerCase().includes(searchValue) ||
				(b.category || "").toLowerCase().includes(searchValue) ||
				(b.author || "").toLowerCase().includes(searchValue) ||
				(b.slug || "").toLowerCase().includes(searchValue)
			);
		},
		getRowId: (row) => row.id,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
	});

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			setData((data) => {
				const oldIndex = data.findIndex((d) => d.id === active.id);
				const newIndex = data.findIndex((d) => d.id === over.id);
				return arrayMove(data, oldIndex, newIndex);
			});
		}
	}

	const stats = React.useMemo(() => {
		return {
			published: data.filter((b) => b.status === "published").length,
			draft: data.filter((b) => b.status === "draft").length,
			archived: data.filter((b) => b.status === "archived").length,
		};
	}, [data]);

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			defaultValue="all"
			className="w-full flex-col justify-start gap-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 lg:px-6">
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
					<TabsTrigger value="all">
						All Blogs <Badge variant="secondary">{data.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="published">
						Published <Badge variant="secondary">{stats.published}</Badge>
					</TabsTrigger>
					<TabsTrigger value="draft">
						Drafts <Badge variant="secondary">{stats.draft}</Badge>
					</TabsTrigger>
					<TabsTrigger value="archived">
						Archived <Badge variant="secondary">{stats.archived}</Badge>
					</TabsTrigger>
				</TabsList>

				<div className="flex items-center gap-2">
					<Button onClick={() => router.push("/dashboard/blogs/create")}>
						<IconPlus className="size-4" />
						Create Blog
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="outline">
									<IconLayoutColumns />
									<span className="hidden lg:inline">Customise Columns</span>
									<span className="lg:hidden">Columns</span>
									<IconChevronDown />
								</Button>
							}
						/>
						<DropdownMenuContent
							align="end"
							className="w-56">
							{table
								.getAllColumns()
								.filter(
									(column) =>
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
								)
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}>
											{column.id === "blog" ? "Article" : column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="max-w-md px-4 lg:px-6">
				<div className="relative">
					<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search blogs by title, category, author..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{["all", "published", "draft", "archived"].map((tab) => (
				<TabsContent
					key={tab}
					value={tab}
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
					<div className="overflow-hidden rounded-lg border bg-card">
						<DndContext
							collisionDetection={closestCenter}
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={handleDragEnd}
							sensors={sensors}
							id={`${sortableId}-${tab}`}>
							<Table>
								<TableHeader className="bg-muted sticky top-0 z-10">
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead
														key={header.id}
														colSpan={header.colSpan}>
														{header.isPlaceholder ? null : (
															<FlexRender header={header} />
														)}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody className="**:data-[slot=table-cell]:first:w-8">
									{table.getRowModel().rows?.length ? (
										<SortableContext
											items={dataIds}
											strategy={verticalListSortingStrategy}>
											{table.getRowModel().rows.map((row) => (
												<DraggableRow
													key={row.id}
													row={row}
												/>
											))}
										</SortableContext>
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-28 text-center text-muted-foreground">
												No blogs found. Click &quot;Create Blog&quot; to write
												your first post!
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</DndContext>
					</div>

					<div className="flex items-center justify-between px-4">
						<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className="flex w-full items-center gap-8 lg:w-fit">
							<div className="hidden items-center gap-2 lg:flex">
								<Label
									htmlFor="rows-per-page"
									className="text-sm font-medium">
									Rows per page
								</Label>
								<Select
									value={`${table.state.pagination.pageSize}`}
									onValueChange={(value) => {
										table.setPageSize(Number(value));
									}}>
									<SelectTrigger
										size="sm"
										className="w-20"
										id="rows-per-page">
										<SelectValue
											placeholder={table.state.pagination.pageSize}
										/>
									</SelectTrigger>
									<SelectContent side="top">
										{[10, 20, 30, 40, 50].map((pageSize) => (
											<SelectItem
												key={pageSize}
												value={`${pageSize}`}>
												{pageSize}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex w-fit items-center justify-center text-sm font-medium">
								Page {table.state.pagination.pageIndex + 1} of{" "}
								{table.getPageCount() || 1}
							</div>
							<div className="ml-auto flex items-center gap-2 lg:ml-0">
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}>
									<span className="sr-only">Go to first page</span>
									<IconChevronsLeft />
								</Button>
								<Button
									variant="outline"
									className="size-8"
									size="icon"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}>
									<span className="sr-only">Go to previous page</span>
									<IconChevronLeft />
								</Button>
								<Button
									variant="outline"
									className="size-8"
									size="icon"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}>
									<span className="sr-only">Go to next page</span>
									<IconChevronRight />
								</Button>
								<Button
									variant="outline"
									className="hidden size-8 lg:flex"
									size="icon"
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}>
									<span className="sr-only">Go to last page</span>
									<IconChevronsRight />
								</Button>
							</div>
						</div>
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
