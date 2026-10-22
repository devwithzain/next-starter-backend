"use client";
import * as React from "react";
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
import { toast } from "sonner";
import { User } from "@/schemas";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DragHandle({ id }: { id: string }) {
	const { attributes, listeners } = useSortable({
		id,
	});

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent">
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}

function UserActions({ user }: { user: User }) {
	const router = useRouter();
	const { refetch } = authClient.useSession();

	function handleImpersonateUser(userId: string) {
		authClient.admin.impersonateUser(
			{ userId },
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to impersonate");
				},
				onSuccess: () => {
					refetch();
					router.push("/dashboard");
				},
			},
		);
	}

	function handleBanUser(userId: string) {
		authClient.admin.banUser(
			{ userId },
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to ban user");
				},
				onSuccess: () => {
					toast.success("User banned");
					router.refresh();
				},
			},
		);
	}

	function handleUnbanUser(userId: string) {
		authClient.admin.unbanUser(
			{ userId },
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to unban user");
				},
				onSuccess: () => {
					toast.success("User unbanned");
					router.refresh();
				},
			},
		);
	}

	function handleRevokeSessions(userId: string) {
		authClient.admin.revokeUserSessions(
			{ userId },
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to revoke user sessions");
				},
				onSuccess: () => {
					toast.success("User sessions revoked");
					router.refresh();
				},
			},
		);
	}

	function handleRemoveUser(userId: string) {
		authClient.admin.removeUser(
			{ userId },
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to delete user");
				},
				onSuccess: () => {
					toast.success("User deleted");
					router.refresh();
				},
			},
		);
	}

	return (
		<>
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
						<IconDotsVertical />
						<span className="sr-only">Open menu</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-40">
						<DropdownMenuItem onClick={() => handleImpersonateUser(user.id)}>
							Impersonate
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
							Revoke Sessions
						</DropdownMenuItem>
						{user.banned ? (
							<DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
								Unban User
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem onClick={() => handleBanUser(user.id)}>
								Ban User
							</DropdownMenuItem>
						)}
						<DropdownMenuSeparator />
						<AlertDialogTrigger
							render={
								<DropdownMenuItem variant="destructive">
									Delete User
								</DropdownMenuItem>
							}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this user? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => handleRemoveUser(user.id)}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
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

const columnHelper = createColumnHelper<typeof features, User>();

const columns = columnHelper.columns([
	columnHelper.display({
		id: "drag",
		header: () => null,
		cell: ({ row }) => <DragHandle id={row.original.id} />,
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
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
	columnHelper.accessor("name", {
		header: "Name",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div>
					<div className="font-medium">{user.name || "No name"}</div>
					<div className="flex items-center gap-2 mt-2">
						{user.banned && <Badge variant="destructive">Banned</Badge>}
					</div>
				</div>
			);
		},
		enableHiding: false,
	}),
	columnHelper.accessor("email", {
		header: "Email",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div>
					<div className="font-medium">{user.email}</div>
				</div>
			);
		},
		enableHiding: false,
	}),
	columnHelper.accessor("role", {
		header: "Role",
		cell: ({ row }) => (
			<Badge variant="secondary">{row.original.role || "user"}</Badge>
		),
	}),
	columnHelper.accessor("emailVerified", {
		header: "Verified",
		cell: ({ row }) => (
			<Badge variant={row.original.emailVerified ? "default" : "outline"}>
				{row.original.emailVerified ? "Verified" : "Unverified"}
			</Badge>
		),
	}),
	columnHelper.accessor("createdAt", {
		header: "Created At",
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return date.toLocaleDateString();
		},
	}),
	columnHelper.display({
		id: "actions",
		cell: ({ row }) => <UserActions user={row.original} />,
	}),
]);

function DraggableRow({ row }: { row: Row<typeof features, User> }) {
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

export function UserTable({ data: initialData }: { data: User[] }) {
	const [data, setData] = React.useState(() => initialData);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<ColumnVisibilityState>({});
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

	const filteredData = React.useMemo(() => {
		return data.filter((user) => {
			if (activeTab === "verified") return user.emailVerified;
			if (activeTab === "unverified") return !user.emailVerified;
			if (activeTab === "banned") return user.banned;
			return true;
		});
	}, [data, activeTab]);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => filteredData?.map(({ id }) => id) || [],
		[filteredData],
	);

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
			row: Row<typeof features, User>,
			columnId: string,
			value: string,
		) => {
			const user = row.original;
			const searchValue = value.toLowerCase();
			return (
				(user.name || "").toLowerCase().includes(searchValue) ||
				user.email.toLowerCase().includes(searchValue)
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

	// Count users by category
	const stats = React.useMemo(() => {
		return {
			admins: data.filter((u) => u.role === "admin").length,
			verified: data.filter((u) => u.emailVerified).length,
			unverified: data.filter((u) => !u.emailVerified).length,
			banned: data.filter((u) => u.banned).length,
		};
	}, [data]);

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			defaultValue="all"
			className="w-full flex-col justify-start gap-6">
			<div className="flex items-center justify-between px-4 lg:px-6">
				<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
					<TabsTrigger value="all">
						All Users <Badge variant="secondary">{data.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="verified">
						Verified <Badge variant="secondary">{stats.verified}</Badge>
					</TabsTrigger>
					<TabsTrigger value="unverified">
						Unverified <Badge variant="secondary">{stats.unverified}</Badge>
					</TabsTrigger>
					<TabsTrigger value="banned">
						Banned <Badge variant="secondary">{stats.banned}</Badge>
					</TabsTrigger>
				</TabsList>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="outline"
									size="sm">
									<IconLayoutColumns />
									<span className="hidden lg:inline">Customise Columns</span>
									<span className="lg:hidden">Columns</span>
									<IconChevronDown />
								</Button>
							}>
							{/* Content of button is inside children */}
						</DropdownMenuTrigger>
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
											{column.id}
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
						placeholder="Search by name or email..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{/* Table */}
			<TabsContent
				value="all"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border">
					<DndContext
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						onDragEnd={handleDragEnd}
						sensors={sensors}
						id={sortableId}>
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
											className="h-24 text-center">
											No results.
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
									<SelectValue placeholder={table.state.pagination.pageSize} />
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
							{table.getPageCount()}
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

			{["verified", "unverified", "banned"].map((tab) => (
				<TabsContent
					key={tab}
					value={tab}
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
					<div className="overflow-hidden rounded-lg border">
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
												className="h-24 text-center">
												No results.
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
								{table.getPageCount()}
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
