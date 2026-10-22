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
	IconCalendar,
	IconCheck,
	IconClock,
	IconX,
	IconCar,
	IconPlus,
	IconUserCheck,
	IconUserX,
	IconUser,
	IconTrash,
	IconSend,
	IconCircleX,
	IconCurrencyPound,
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
import { useSearchParams } from "next/navigation";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Appointment,
	Mechanic,
	AppointmentStatus,
	PaymentStatus,
} from "@/types";
import {
	updateAppointmentStatus,
	createAppointment,
	assignMechanicToBooking,
	deleteAppointment,
	approveAndSendQuote,
	rejectQuote,
} from "@/lib/actions/appointments";
import { toast } from "sonner";
import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

function getStatusBadge(status: AppointmentStatus) {
	switch (status) {
		case "confirmed":
			return (
				<Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 border-blue-500/30">
					Confirmed
				</Badge>
			);
		case "in_progress":
			return (
				<Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border-purple-500/30">
					In Progress
				</Badge>
			);
		case "completed":
			return (
				<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border-emerald-500/30">
					Completed
				</Badge>
			);
		case "cancelled":
			return <Badge variant="destructive">Cancelled</Badge>;
		case "quote_requested":
			return (
				<Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 border-orange-500/30">
					⏳ Quote Requested
				</Badge>
			);
		case "quote_sent":
			return (
				<Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 border-cyan-500/30">
					✉️ Quote Sent
				</Badge>
			);
		case "quote_rejected":
			return (
				<Badge className="bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/20 border-red-500/30">
					✗ Quote Rejected
				</Badge>
			);
		case "pending":
		default:
			return (
				<Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border-amber-500/30">
					Pending
				</Badge>
			);
	}
}

function getPaymentBadge(status: PaymentStatus) {
	switch (status) {
		case "paid":
			return (
				<Badge
					variant="outline"
					className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
					Paid
				</Badge>
			);
		case "refunded":
			return (
				<Badge
					variant="outline"
					className="text-zinc-500 border-zinc-500/30 font-medium">
					Refunded
				</Badge>
			);
		case "failed":
			return (
				<Badge
					variant="destructive"
					className="font-medium">
					Failed
				</Badge>
			);
		case "pending":
		default:
			return (
				<Badge
					variant="outline"
					className="text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium">
					Unpaid
				</Badge>
			);
	}
}

function MechanicCell({
	appointment,
	mechanics,
	onAssign,
}: {
	appointment: Appointment;
	mechanics: Mechanic[];
	onAssign: (appointmentId: string, mechanicId: string | null) => void;
}) {
	const assigned =
		mechanics.find((m) => m.id === appointment.mechanicId) ||
		appointment.mechanic;

	return (
		<div className="flex items-center gap-1.5">
			<Select
				value={appointment.mechanicId || "unassigned"}
				onValueChange={(val) => {
					onAssign(appointment.id, val === "unassigned" ? null : val);
				}}>
				<SelectTrigger
					size="sm"
					className="h-8 max-w-[170px] text-xs font-normal border-zinc-200 dark:border-zinc-800 bg-background/80">
					<SelectValue>
						{assigned ? (
							<div className="flex items-center gap-1.5 truncate">
								<span className="size-2 rounded-full bg-emerald-500 shrink-0" />
								<span className="font-medium text-foreground truncate">
									{assigned.name}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1.5 text-muted-foreground truncate">
								<span className="size-2 rounded-full bg-zinc-400 shrink-0" />
								<span>Unassigned</span>
							</div>
						)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent className="w-56">
					<SelectItem
						value="unassigned"
						className="text-muted-foreground text-xs font-medium">
						<div className="flex items-center gap-2">
							<IconUserX className="size-3.5 text-zinc-400" />
							<span>Unassign (No Mechanic)</span>
						</div>
					</SelectItem>
					{mechanics.map((m) => (
						<SelectItem
							key={m.id}
							value={m.id}
							className="text-xs">
							<div className="flex flex-col gap-0.5">
								<div className="flex items-center gap-2 font-medium">
									<IconUserCheck className="size-3.5 text-emerald-500 shrink-0" />
									<span>{m.name}</span>
								</div>
								<span className="text-[10px] text-muted-foreground pl-5.5">
									{m.specialty || "Technician"} · {m.activeBookingsCount} active
								</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

function AppointmentActions({
	appointment,
	mechanics,
	onStatusChange,
	onAssign,
	onDelete,
}: {
	appointment: Appointment;
	mechanics: Mechanic[];
	onStatusChange: (id: string, status: AppointmentStatus) => void;
	onAssign: (appointmentId: string, mechanicId: string | null) => void;
	onDelete: (id: string) => void;
}) {
	const [isAssignDialogOpen, setIsAssignDialogOpen] = React.useState(false);
	const [isSendQuoteDialogOpen, setIsSendQuoteDialogOpen] = React.useState(false);
	const [isRejectQuoteDialogOpen, setIsRejectQuoteDialogOpen] = React.useState(false);
	const [quoteAmount, setQuoteAmount] = React.useState("");
	const [quoteNotes, setQuoteNotes] = React.useState("");
	const [rejectReason, setRejectReason] = React.useState("");
	const [isSendingQuote, setIsSendingQuote] = React.useState(false);
	const [isRejectingQuote, setIsRejectingQuote] = React.useState(false);
	const [selectedMechanicId, setSelectedMechanicId] = React.useState<string>(
		appointment.mechanicId || "unassigned",
	);

	const isQuoteRequested = appointment.status === "quote_requested";

	async function handleStatusUpdate(newStatus: AppointmentStatus) {
		try {
			await updateAppointmentStatus(appointment.id, newStatus);
			onStatusChange(appointment.id, newStatus);
			toast.success(
				`Booking ${appointment.bookingReference} marked as ${newStatus}`,
			);
		} catch {
			toast.error("Failed to update status");
		}
	}

	async function handleSaveAssignment() {
		const targetId =
			selectedMechanicId === "unassigned" ? null : selectedMechanicId;
		await onAssign(appointment.id, targetId);
		setIsAssignDialogOpen(false);
	}

	async function handleSendQuote() {
		const amount = quoteAmount.trim();
		if (!amount || isNaN(parseFloat(amount))) {
			toast.error("Please enter a valid quote amount");
			return;
		}
		setIsSendingQuote(true);
		try {
			await approveAndSendQuote(appointment.id, amount, quoteNotes.trim() || undefined);
			onStatusChange(appointment.id, "quote_sent" as AppointmentStatus);
			toast.success(`Quote of £${amount} sent to ${appointment.customerName}`);
			setIsSendQuoteDialogOpen(false);
			setQuoteAmount("");
			setQuoteNotes("");
		} catch {
			toast.error("Failed to send quote. Please try again.");
		} finally {
			setIsSendingQuote(false);
		}
	}

	async function handleRejectQuote() {
		setIsRejectingQuote(true);
		try {
			await rejectQuote(appointment.id, rejectReason.trim() || undefined);
			onStatusChange(appointment.id, "quote_rejected" as AppointmentStatus);
			toast.success(`Quote rejected for booking ${appointment.bookingReference}`);
			setIsRejectQuoteDialogOpen(false);
			setRejectReason("");
		} catch {
			toast.error("Failed to reject quote. Please try again.");
		} finally {
			setIsRejectingQuote(false);
		}
	}

	return (
		<div className="flex items-center justify-end gap-1.5">
			{isQuoteRequested && (
				<Button
					size="sm"
					variant="outline"
					onClick={() => setIsSendQuoteDialogOpen(true)}
					className="h-8 text-xs px-2.5 text-orange-600 dark:text-orange-400 border-orange-500/40 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-semibold gap-1.5 shrink-0">
					<IconSend className="size-3.5" />
					<span>Send Quote</span>
				</Button>
			)}
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
						className="w-56">
						{isQuoteRequested && (
							<>
								<DropdownMenuItem onClick={() => setIsSendQuoteDialogOpen(true)} className="text-orange-600 dark:text-orange-400 focus:text-orange-700">
									<IconSend className="mr-2 size-4 text-orange-500" />
									Send Quote to Customer
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setIsRejectQuoteDialogOpen(true)} className="text-red-600 dark:text-red-400 focus:text-red-700">
									<IconCircleX className="mr-2 size-4 text-red-500" />
									Reject Quote Request
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
							<IconUser className="mr-2 size-4 text-blue-500" />
							Assign Mechanic
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => handleStatusUpdate("confirmed")}>
							<IconCheck className="mr-2 size-4 text-blue-500" />
							Confirm Booking
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleStatusUpdate("in_progress")}>
							<IconClock className="mr-2 size-4 text-purple-500" />
							Mark In Progress
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleStatusUpdate("completed")}>
							<IconCheck className="mr-2 size-4 text-emerald-500" />
							Mark Completed
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<AlertDialogTrigger
							render={
								<DropdownMenuItem variant="destructive">
									<IconX className="mr-2 size-4" />
									Cancel Booking
								</DropdownMenuItem>
							}
						/>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(appointment.id)}>
							<IconTrash className="mr-2 size-4" />
							Delete Booking
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to cancel booking{" "}
							{appointment.bookingReference} for {appointment.customerName}?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep Booking</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => handleStatusUpdate("cancelled")}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							Cancel Appointment
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Dialog
				open={isAssignDialogOpen}
				onOpenChange={setIsAssignDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Assign Mobile Mechanic</DialogTitle>
						<DialogDescription>
							Select a mechanic to handle booking {appointment.bookingReference}{" "}
							({appointment.vehicleSummary}).
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<Field>
							<FieldLabel>Select Mechanic</FieldLabel>
							<Select
								value={selectedMechanicId}
								onValueChange={(val) => {
									if (val) setSelectedMechanicId(val);
								}}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choose a mechanic..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="unassigned">
										<div className="flex items-center gap-2 text-muted-foreground font-medium">
											<IconUserX className="size-4 text-zinc-400" />
											<span>Unassigned (Remove Assignment)</span>
										</div>
									</SelectItem>
									{mechanics.map((m) => (
										<SelectItem
											key={m.id}
											value={m.id}>
											<div className="flex items-center gap-2">
												<IconUserCheck className="size-4 text-emerald-500" />
												<span className="font-medium">{m.name}</span>
												<span className="text-xs text-muted-foreground">
													({m.specialty || "Mechanic"} · {m.activeBookingsCount}{" "}
													active)
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAssignDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveAssignment}>Confirm Assignment</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Send Quote Dialog */}
			<Dialog open={isSendQuoteDialogOpen} onOpenChange={setIsSendQuoteDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<IconSend className="size-5 text-orange-500" />
							Send Quote to Customer
						</DialogTitle>
						<DialogDescription>
							Enter the final quote amount for booking {appointment.bookingReference}.
							The customer will be notified to proceed with payment.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
							<p className="text-sm font-medium text-orange-800 dark:text-orange-300">{appointment.customerName}</p>
							<p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">{appointment.vehicleSummary} · {appointment.services?.join(", ")}</p>
							{appointment.notes && (
								<p className="text-xs text-orange-500 mt-1 italic">Notes: {appointment.notes}</p>
							)}
						</div>
						<Field>
							<FieldLabel>Final Quote Amount (£)</FieldLabel>
							<div className="relative">
								<IconCurrencyPound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
								<Input
									type="number"
									step="0.01"
									min="0"
									placeholder="e.g. 250.00"
									value={quoteAmount}
									onChange={(e) => setQuoteAmount(e.target.value)}
									className="pl-9"
								/>
							</div>
						</Field>
						<Field>
							<FieldLabel>Admin Notes (optional)</FieldLabel>
							<Input
								placeholder="e.g. Parts cost included, labour 2hrs..."
								value={quoteNotes}
								onChange={(e) => setQuoteNotes(e.target.value)}
							/>
						</Field>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsSendQuoteDialogOpen(false)} disabled={isSendingQuote}>
							Cancel
						</Button>
						<Button onClick={handleSendQuote} disabled={isSendingQuote} className="bg-orange-600 hover:bg-orange-700 text-white">
							{isSendingQuote ? (
								<><IconClock className="mr-2 size-4 animate-spin" />Sending...</>
							) : (
								<><IconSend className="mr-2 size-4" />Send Quote</>)
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reject Quote Dialog */}
			<Dialog open={isRejectQuoteDialogOpen} onOpenChange={setIsRejectQuoteDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<IconCircleX className="size-5 text-red-500" />
							Reject Quote Request
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to reject the quote request for booking {appointment.bookingReference}?
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Field>
							<FieldLabel>Rejection Reason (optional)</FieldLabel>
							<Input
								placeholder="e.g. Outside service area, parts unavailable..."
								value={rejectReason}
								onChange={(e) => setRejectReason(e.target.value)}
							/>
						</Field>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsRejectQuoteDialogOpen(false)} disabled={isRejectingQuote}>
							Cancel
						</Button>
						<Button onClick={handleRejectQuote} disabled={isRejectingQuote} variant="destructive">
							{isRejectingQuote ? (
								<><IconClock className="mr-2 size-4 animate-spin" />Rejecting...</>
							) : (
								<><IconCircleX className="mr-2 size-4" />Reject Quote</>)
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
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

const columnHelper = createColumnHelper<typeof features, Appointment>();

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
	columnHelper.accessor("bookingReference", {
		header: "Ref / Date",
		cell: ({ row }) => {
			const appt = row.original;
			return (
				<div>
					<div className="font-bold text-xs text-foreground tracking-wide">
						{appt.bookingReference}
					</div>
					<div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
						<IconCalendar className="size-3" />
						{appt.scheduledDate} · {appt.scheduledTime}
					</div>
				</div>
			);
		},
		enableHiding: false,
	}),
	columnHelper.accessor("customerName", {
		header: "Customer",
		cell: ({ row }) => {
			const appt = row.original;
			return (
				<div>
					<div className="font-medium text-sm text-foreground">
						{appt.customerName}
					</div>
					<div className="text-xs text-muted-foreground">
						{appt.customerEmail}
					</div>
				</div>
			);
		},
		enableHiding: false,
	}),
	columnHelper.accessor("vehicleSummary", {
		header: "Vehicle & Location",
		cell: ({ row }) => {
			const appt = row.original;
			return (
				<div className="max-w-[280px]">
					<div className="font-medium text-xs text-foreground flex items-center gap-1.5">
						<IconCar className="size-3.5 text-red-500 shrink-0" />
						<span className="truncate">{appt.vehicleSummary}</span>
					</div>
					<div className="text-[11px] text-muted-foreground mt-0.5">
						Postcode:{" "}
						<span className="font-medium text-foreground">{appt.postcode}</span>
					</div>
					{appt.notes && (
						<div
							className="text-[11px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded mt-1 line-clamp-2"
							title={appt.notes}>
							<span className="font-semibold text-amber-700 dark:text-amber-400">Notes / Issue:</span> {appt.notes}
						</div>
					)}
				</div>
			);
		},
	}),
	columnHelper.display({
		id: "assignedMechanic",
		header: "Assigned Mechanic",
		cell: ({ row, table }) => {
			const meta = table.options.meta as {
				mechanics: Mechanic[];
				onAssign: (appointmentId: string, mechanicId: string | null) => void;
			};
			return (
				<MechanicCell
					appointment={row.original}
					mechanics={meta.mechanics}
					onAssign={meta.onAssign}
				/>
			);
		},
	}),
	columnHelper.accessor("services", {
		header: "Services",
		cell: ({ row }) => {
			const services = row.original.services || [];
			if (services.length === 0) {
				return (
					<span className="text-xs text-muted-foreground">
						Standard Service
					</span>
				);
			}
			return (
				<div className="flex flex-wrap gap-1 max-w-[200px]">
					{services.map((s, idx) => (
						<Badge
							key={idx}
							variant="secondary"
							className="text-[10px] font-normal py-0 px-1.5">
							{s}
						</Badge>
					))}
				</div>
			);
		},
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: ({ row }) => getStatusBadge(row.original.status),
	}),
	columnHelper.accessor("totalAmount", {
		header: "Total & Paid",
		cell: ({ row }) => {
			const appt = row.original;
			return (
				<div>
					<div className="font-semibold text-sm">£{appt.totalAmount}</div>
					<div className="mt-1">{getPaymentBadge(appt.paymentStatus)}</div>
				</div>
			);
		},
	}),
	columnHelper.display({
		id: "actions",
		cell: ({ row, table }) => {
			const meta = table.options.meta as {
				mechanics: Mechanic[];
				onStatusChange: (id: string, status: AppointmentStatus) => void;
				onAssign: (appointmentId: string, mechanicId: string | null) => void;
				onDelete: (id: string) => void;
			};
			return (
				<AppointmentActions
					appointment={row.original}
					mechanics={meta.mechanics}
					onStatusChange={meta.onStatusChange}
					onAssign={meta.onAssign}
					onDelete={meta.onDelete}
				/>
			);
		},
	}),
]);

function DraggableRow({ row }: { row: Row<typeof features, Appointment> }) {
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

export function AppointmentTable({
	data: initialData = [],
	mechanics = [],
}: {
	data: Appointment[];
	mechanics?: Mechanic[];
}) {
	const [data, setData] = React.useState<Appointment[]>(() => initialData);
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
	const searchParams = useSearchParams();
	const tabFromUrl = searchParams.get("tab");
	const [activeTab, setActiveTab] = React.useState(tabFromUrl || "all");

	React.useEffect(() => {
		if (tabFromUrl) {
			setActiveTab(tabFromUrl);
		}
	}, [tabFromUrl]);

	const [isAddOpen, setIsAddOpen] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// Sync state when initialData changes
	React.useEffect(() => {
		setData(initialData);
	}, [initialData]);

	// New Appointment Form State
	const [newCustomerName, setNewCustomerName] = React.useState("");
	const [newCustomerEmail, setNewCustomerEmail] = React.useState("");
	const [newCustomerPhone, setNewCustomerPhone] = React.useState("");
	const [newVehicle, setNewVehicle] = React.useState("");
	const [newPostcode, setNewPostcode] = React.useState("");
	const [newDate, setNewDate] = React.useState(() => {
		return new Date().toISOString().split("T")[0];
	});
	const [newTime, setNewTime] = React.useState("10:00 AM");
	const [newService, setNewService] = React.useState("Full Engine Service");
	const [newAmount, setNewAmount] = React.useState("85.00");
	const [newMechanicId, setNewMechanicId] =
		React.useState<string>("unassigned");

	async function handleCreateBooking(e: React.FormEvent) {
		e.preventDefault();
		if (!newCustomerName.trim() || !newVehicle.trim() || !newPostcode.trim()) {
			toast.error("Please fill in customer, vehicle and postcode");
			return;
		}

		setIsSubmitting(true);
		try {
			const selectedMech = mechanics.find((m) => m.id === newMechanicId);
			const res = await createAppointment({
				customerName: newCustomerName.trim(),
				customerEmail: newCustomerEmail.trim() || "customer@example.com",
				customerPhone: newCustomerPhone.trim(),
				vehicleSummary: newVehicle.trim(),
				postcode: newPostcode.trim().toUpperCase(),
				scheduledDate: newDate,
				scheduledTime: newTime,
				serviceName: newService,
				mechanicId: newMechanicId === "unassigned" ? null : newMechanicId,
				totalAmount: parseFloat(newAmount || "85").toFixed(2),
				callOutFee: "15.00",
			});

			const newRecord: Appointment = {
				id: res.id,
				bookingReference: res.bookingReference,
				customerName: newCustomerName.trim(),
				customerEmail: newCustomerEmail.trim() || "customer@example.com",
				customerPhone: newCustomerPhone.trim(),
				vehicleSummary: newVehicle.trim(),
				mechanicId: newMechanicId === "unassigned" ? null : newMechanicId,
				mechanic: selectedMech || null,
				postcode: newPostcode.trim().toUpperCase(),
				serviceLocation: "Customer Driveway",
				scheduledDate: newDate,
				scheduledTime: newTime,
				status: "pending",
				callOutFee: "15.00",
				subtotalAmount: (parseFloat(newAmount || "85") - 15).toFixed(2),
				totalAmount: parseFloat(newAmount || "85").toFixed(2),
				paymentStatus: "pending",
				paymentMethod: "stripe",
				notes: `Service: ${newService}`,
				services: [newService],
				createdAt: new Date().toISOString(),
			};

			setData((prev) => [newRecord, ...prev]);
			toast.success(`Booking ${res.bookingReference} scheduled!`);
			setIsAddOpen(false);
			setNewCustomerName("");
			setNewCustomerEmail("");
			setNewCustomerPhone("");
			setNewVehicle("");
			setNewPostcode("");
			setNewMechanicId("unassigned");
		} catch {
			toast.error("Failed to create booking");
		} finally {
			setIsSubmitting(false);
		}
	}

	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const handleStatusChange = React.useCallback(
		(id: string, status: AppointmentStatus) => {
			setData((prev) =>
				prev.map((item) => (item.id === id ? { ...item, status } : item)),
			);
		},
		[],
	);

	const handleAssignMechanic = React.useCallback(
		async (appointmentId: string, mechanicId: string | null) => {
			const targetMech = mechanics.find((m) => m.id === mechanicId) || null;
			setData((prev) =>
				prev.map((item) =>
					item.id === appointmentId
						? { ...item, mechanicId, mechanic: targetMech }
						: item,
				),
			);

			try {
				await assignMechanicToBooking(appointmentId, mechanicId);
				toast.success(
					targetMech
						? `Mechanic ${targetMech.name} assigned!`
						: "Booking unassigned",
				);
			} catch {
				toast.error("Failed to update mechanic assignment");
			}
		},
		[mechanics],
	);

	const handleDelete = React.useCallback(async (id: string) => {
		try {
			await deleteAppointment(id);
			setData((prev) => prev.filter((item) => item.id !== id));
			toast.success("Appointment deleted");
		} catch {
			toast.error("Failed to delete appointment");
		}
	}, []);

	const filteredData = React.useMemo(() => {
		return data.filter((appt) => {
			if (activeTab === "quotes") return appt.status?.startsWith("quote_");
			if (activeTab === "pending") return appt.status === "pending";
			if (activeTab === "confirmed") return appt.status === "confirmed";
			if (activeTab === "in_progress") return appt.status === "in_progress";
			if (activeTab === "completed") return appt.status === "completed";
			if (activeTab === "cancelled") return appt.status === "cancelled";
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
		meta: {
			mechanics,
			onStatusChange: handleStatusChange,
			onAssign: handleAssignMechanic,
			onDelete: handleDelete,
		},
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
			globalFilter,
		},
		globalFilterFn: (
			row: Row<typeof features, Appointment>,
			columnId: string,
			value: string,
		) => {
			const appt = row.original;
			const searchValue = value.toLowerCase();
			return (
				appt.bookingReference.toLowerCase().includes(searchValue) ||
				appt.customerName.toLowerCase().includes(searchValue) ||
				appt.customerEmail.toLowerCase().includes(searchValue) ||
				appt.vehicleSummary.toLowerCase().includes(searchValue) ||
				appt.postcode.toLowerCase().includes(searchValue) ||
				(appt.mechanic?.name || "").toLowerCase().includes(searchValue)
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
			all: data.length,
			quotes: data.filter((a) => a.status?.startsWith("quote_")).length,
			pending: data.filter((a) => a.status === "pending").length,
			confirmed: data.filter((a) => a.status === "confirmed").length,
			in_progress: data.filter((a) => a.status === "in_progress").length,
			completed: data.filter((a) => a.status === "completed").length,
			cancelled: data.filter((a) => a.status === "cancelled").length,
		};
	}, [data]);

	const tabsList = [
		{ value: "all", label: "All Bookings", count: stats.all },
		{ value: "quotes", label: "Quote Requests", count: stats.quotes },
		{ value: "pending", label: "Pending", count: stats.pending },
		{ value: "confirmed", label: "Confirmed", count: stats.confirmed },
		{ value: "in_progress", label: "In Progress", count: stats.in_progress },
		{ value: "completed", label: "Completed", count: stats.completed },
		{ value: "cancelled", label: "Cancelled", count: stats.cancelled },
	];

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			defaultValue="all"
			className="w-full flex-col justify-start gap-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
				<TabsList className="overflow-x-auto no-scrollbar justify-start **:data-[slot=badge]:bg-muted-foreground/20 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
					{tabsList.map((t) => (
						<TabsTrigger
							key={t.value}
							value={t.value}>
							{t.label} <Badge variant="secondary">{t.count}</Badge>
						</TabsTrigger>
					))}
				</TabsList>
				<div className="flex items-center gap-2 self-end sm:self-auto">
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
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
				<div className="relative flex-1 max-w-md">
					<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search by ref, customer, vehicle, mechanic, postcode..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-10"
					/>
				</div>

				<Dialog
					open={isAddOpen}
					onOpenChange={setIsAddOpen}>
					<DialogTrigger
						render={
							<Button className="shrink-0 gap-1.5 font-medium">
								<IconPlus className="size-4" />
								New Booking
							</Button>
						}
					/>
					<DialogContent className="sm:max-w-lg">
						<DialogHeader>
							<DialogTitle>Create Service Appointment</DialogTitle>
							<DialogDescription>
								Schedule a mobile mechanic visit or customer call-out booking.
							</DialogDescription>
						</DialogHeader>

						<form
							onSubmit={handleCreateBooking}
							className="flex flex-col gap-4">
							<FieldGroup>
								<div className="grid grid-cols-2 gap-3">
									<Field>
										<FieldLabel>Customer Name</FieldLabel>
										<Input
											placeholder="Jane Doe"
											value={newCustomerName}
											onChange={(e) => setNewCustomerName(e.target.value)}
											required
										/>
									</Field>

									<Field>
										<FieldLabel>Phone Number</FieldLabel>
										<Input
											placeholder="+44 7700 900123"
											value={newCustomerPhone}
											onChange={(e) => setNewCustomerPhone(e.target.value)}
										/>
									</Field>
								</div>

								<Field>
									<FieldLabel>Customer Email</FieldLabel>
									<Input
										type="email"
										placeholder="jane@example.co.uk"
										value={newCustomerEmail}
										onChange={(e) => setNewCustomerEmail(e.target.value)}
									/>
								</Field>

								<div className="grid grid-cols-2 gap-3">
									<Field>
										<FieldLabel>Vehicle & Reg</FieldLabel>
										<Input
											placeholder="BMW 320d (EA21 ABC)"
											value={newVehicle}
											onChange={(e) => setNewVehicle(e.target.value)}
											required
										/>
									</Field>

									<Field>
										<FieldLabel>Postcode</FieldLabel>
										<Input
											placeholder="NW10 7AB"
											value={newPostcode}
											onChange={(e) => setNewPostcode(e.target.value)}
											className="uppercase font-bold"
											required
										/>
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field>
										<FieldLabel>Service Required</FieldLabel>
										<Input
											placeholder="Full Engine Service"
											value={newService}
											onChange={(e) => setNewService(e.target.value)}
											required
										/>
									</Field>

									<Field>
										<FieldLabel>Total (£ GBP)</FieldLabel>
										<Input
											type="number"
											step="0.01"
											placeholder="85.00"
											value={newAmount}
											onChange={(e) => setNewAmount(e.target.value)}
											required
										/>
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field>
										<FieldLabel>Scheduled Date</FieldLabel>
										<Input
											type="date"
											value={newDate}
											onChange={(e) => setNewDate(e.target.value)}
											required
										/>
									</Field>

									<Field>
										<FieldLabel>Time Slot</FieldLabel>
										<Input
											placeholder="10:00 AM - 12:00 PM"
											value={newTime}
											onChange={(e) => setNewTime(e.target.value)}
											required
										/>
									</Field>
								</div>

								<Field>
									<FieldLabel>Assign Mechanic (Optional)</FieldLabel>
									<Select
										value={newMechanicId}
										onValueChange={(val) => {
											if (val) setNewMechanicId(val);
										}}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Unassigned" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="unassigned">
												<span className="text-muted-foreground">
													Unassigned (Decide Later)
												</span>
											</SelectItem>
											{mechanics.map((m) => (
												<SelectItem
													key={m.id}
													value={m.id}>
													{m.name} ({m.specialty || "Mechanic"} ·{" "}
													{m.activeBookingsCount} active)
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							</FieldGroup>

							<DialogFooter className="mt-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsAddOpen(false)}>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? "Scheduling..." : "Create Booking"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<TabsContent
				value={activeTab}
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border bg-background">
					<DndContext
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						onDragEnd={handleDragEnd}
						sensors={sensors}
						id={sortableId}>
						<Table>
							<TableHeader className="bg-muted/50 sticky top-0 z-10">
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
											className="h-36 text-center text-muted-foreground">
											<div className="flex flex-col items-center justify-center gap-2 py-4">
												<IconCar className="size-8 text-muted-foreground/50" />
												<p className="font-medium text-sm text-foreground">
													No bookings found in database
												</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</DndContext>
				</div>

				<div className="flex items-center justify-between px-2">
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
		</Tabs>
	);
}
