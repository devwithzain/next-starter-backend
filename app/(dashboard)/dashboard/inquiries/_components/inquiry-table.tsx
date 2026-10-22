"use client";
import React, { useState, useMemo } from "react";
import {
	IconSearch,
	IconPhone,
	IconMail,
	IconCar,
	IconCheck,
	IconClock,
	IconTrash,
	IconDotsVertical,
	IconMessageDots,
	IconSparkles,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInquiry } from "@/types";
import {
	updateContactInquiryStatus,
	deleteContactInquiry,
} from "@/lib/actions/inquiries";
import { toast } from "sonner";

export function InquiryTable({
	initialInquiries = [],
}: {
	initialInquiries: ContactInquiry[];
}) {
	const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
	const [activeTab, setActiveTab] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isUpdating, setIsUpdating] = useState<string | null>(null);

	const handleStatusChange = async (
		id: string,
		status: ContactInquiry["status"],
	) => {
		setIsUpdating(id);
		try {
			await updateContactInquiryStatus(id, status);
			setInquiries((prev) =>
				prev.map((item) => (item.id === id ? { ...item, status } : item)),
			);
			toast.success(`Inquiry marked as ${status}`);
		} catch {
			toast.error("Failed to update inquiry status");
		} finally {
			setIsUpdating(null);
		}
	};

	const handleDelete = async (id: string) => {
		setIsUpdating(id);
		try {
			await deleteContactInquiry(id);
			setInquiries((prev) => prev.filter((item) => item.id !== id));
			toast.success("Inquiry deleted");
		} catch {
			toast.error("Failed to delete inquiry");
		} finally {
			setIsUpdating(null);
		}
	};

	const filteredInquiries = useMemo(() => {
		return inquiries.filter((inq) => {
			if (activeTab === "new" && inq.status !== "new") return false;
			if (activeTab === "contacted" && inq.status !== "contacted") return false;
			if (activeTab === "resolved" && inq.status !== "resolved") return false;

			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchName = inq.fullName.toLowerCase().includes(q);
				const matchEmail = inq.email.toLowerCase().includes(q);
				const matchPhone = inq.phone.toLowerCase().includes(q);
				const matchReg = (inq.registrationNumber || "")
					.toLowerCase()
					.includes(q);
				const matchMsg = inq.message.toLowerCase().includes(q);
				return matchName || matchEmail || matchPhone || matchReg || matchMsg;
			}
			return true;
		});
	}, [inquiries, activeTab, searchQuery]);

	const stats = useMemo(() => {
		return {
			all: inquiries.length,
			new: inquiries.filter((i) => i.status === "new").length,
			contacted: inquiries.filter((i) => i.status === "contacted").length,
			resolved: inquiries.filter((i) => i.status === "resolved").length,
		};
	}, [inquiries]);

	const tabsList = [
		{ value: "all", label: "All Inquiries", count: stats.all },
		{ value: "new", label: "New", count: stats.new },
		{ value: "contacted", label: "Contacted", count: stats.contacted },
		{ value: "resolved", label: "Resolved", count: stats.resolved },
	];

	return (
		<div className="flex flex-col gap-4">
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
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
				</div>
			</Tabs>

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
				<div className="relative flex-1 max-w-md">
					<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						placeholder="Search inquiries by customer, email, phone, reg, or issue..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<div className="px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border bg-background">
					<Table>
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="w-[140px]">Date / Time</TableHead>
								<TableHead className="w-[200px]">Customer Details</TableHead>
								<TableHead className="w-[120px]">Vehicle Reg</TableHead>
								<TableHead>Message & Fault Description</TableHead>
								<TableHead className="w-[110px]">Status</TableHead>
								<TableHead className="w-[130px] text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredInquiries.length > 0 ? (
								filteredInquiries.map((inq) => (
									<TableRow
										key={inq.id}
										className={
											inq.status === "new"
												? "bg-amber-500/5 hover:bg-amber-500/10"
												: ""
										}>
										<TableCell className="align-top py-3.5">
											<div className="text-xs font-semibold text-foreground">
												{new Date(inq.createdAt).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})}
											</div>
											<div className="text-[11px] text-muted-foreground mt-0.5">
												{new Date(inq.createdAt).toLocaleTimeString("en-GB", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</TableCell>

										<TableCell className="align-top py-3.5">
											<div className="font-semibold text-xs text-foreground">
												{inq.fullName}
											</div>
											<div className="text-[11px] text-muted-foreground mt-0.5">
												<a
													href={`mailto:${inq.email}`}
													className="hover:text-red-500 transition-colors">
													{inq.email}
												</a>
											</div>
											<div className="text-[11px] font-medium text-foreground mt-0.5">
												<a
													href={`tel:${inq.phone}`}
													className="hover:text-red-500 transition-colors">
													{inq.phone}
												</a>
											</div>
										</TableCell>

										<TableCell className="align-top py-3.5">
											{inq.registrationNumber ? (
												<span className="inline-block bg-amber-200 text-amber-900 border border-amber-300 font-mono font-bold text-xs px-2 py-0.5 rounded shadow-xs uppercase">
													{inq.registrationNumber}
												</span>
											) : (
												<span className="text-xs text-muted-foreground">
													None
												</span>
											)}
										</TableCell>

										<TableCell className="align-top py-3.5">
											<div className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-w-xl bg-muted/40 p-2.5 rounded-md border border-border/50">
												{inq.message}
											</div>
										</TableCell>

										<TableCell className="align-top py-3.5">
											{inq.status === "new" && (
												<Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30">
													<IconSparkles className="size-3 mr-1" /> New
												</Badge>
											)}
											{inq.status === "contacted" && (
												<Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30">
													Contacted
												</Badge>
											)}
											{inq.status === "resolved" && (
												<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
													Resolved
												</Badge>
											)}
										</TableCell>

										<TableCell className="align-top py-3.5 text-right">
											<div className="flex items-center justify-end gap-1">
												<a
													href={`tel:${inq.phone}`}
													title="Call Customer"
													className="p-1.5 text-muted-foreground hover:text-red-600 rounded-md hover:bg-muted transition-colors">
													<IconPhone className="size-4" />
												</a>
												<a
													href={`mailto:${inq.email}?subject=Regarding your enquiry - Talha Autos`}
													title="Email Customer"
													className="p-1.5 text-muted-foreground hover:text-red-600 rounded-md hover:bg-muted transition-colors">
													<IconMail className="size-4" />
												</a>

												<AlertDialog>
													<DropdownMenu>
														<DropdownMenuTrigger
															render={
																<Button
																	variant="ghost"
																	size="icon"
																	className="size-7">
																	<IconDotsVertical className="size-4" />
																	<span className="sr-only">Actions</span>
																</Button>
															}
														/>
														<DropdownMenuContent align="end">
															{inq.status !== "contacted" && (
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(inq.id, "contacted")
																	}>
																	<IconClock className="mr-2 size-4 text-blue-500" />
																	Mark as Contacted
																</DropdownMenuItem>
															)}
															{inq.status !== "resolved" && (
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(inq.id, "resolved")
																	}>
																	<IconCheck className="mr-2 size-4 text-emerald-500" />
																	Mark as Resolved
																</DropdownMenuItem>
															)}
															{inq.status !== "new" && (
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(inq.id, "new")
																	}>
																	<IconSparkles className="mr-2 size-4 text-amber-500" />
																	Mark as New
																</DropdownMenuItem>
															)}
															<DropdownMenuSeparator />
															<AlertDialogTrigger
																render={
																	<DropdownMenuItem variant="destructive">
																		<IconTrash className="mr-2 size-4" />
																		Delete Inquiry
																	</DropdownMenuItem>
																}
															/>
														</DropdownMenuContent>
													</DropdownMenu>

													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Delete Customer Inquiry
															</AlertDialogTitle>
															<AlertDialogDescription>
																Are you sure you want to delete this inquiry
																from {inq.fullName}? This action cannot be
																undone.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => handleDelete(inq.id)}
																className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
																Delete Inquiry
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-36 text-center text-muted-foreground">
										<div className="flex flex-col items-center justify-center gap-2 py-4">
											<IconMessageDots className="size-8 text-muted-foreground/50" />
											<p className="font-medium text-sm text-foreground">
												No inquiries found
											</p>
											<p className="text-xs text-muted-foreground">
												Customer contact form submissions will appear here.
											</p>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
