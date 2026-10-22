"use server";
import { db } from "@/drizzle/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { contactInquiry } from "@/drizzle/schema";
import { ContactInquiry } from "@/types";
import {
	sendContactInquiryNotificationToAdmin,
	sendContactInquiryConfirmationToUser,
} from "@/lib/emails/quote-and-contact-emails";

export async function createContactInquiry(data: {
	fullName: string;
	email: string;
	phone: string;
	registrationNumber?: string;
	message: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
	try {
		if (!data.fullName?.trim() || !data.email?.trim() || !data.phone?.trim() || !data.message?.trim()) {
			return { success: false, error: "Please fill in all required fields." };
		}

		const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
		const inquiryRecord = {
			id,
			fullName: data.fullName.trim(),
			email: data.email.trim().toLowerCase(),
			phone: data.phone.trim(),
			registrationNumber: data.registrationNumber?.trim().toUpperCase() || null,
			message: data.message.trim(),
			status: "new" as const,
			adminNotes: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db.insert(contactInquiry).values(inquiryRecord);

		const fullInquiry: ContactInquiry = {
			...inquiryRecord,
			createdAt: inquiryRecord.createdAt.toISOString(),
			updatedAt: inquiryRecord.updatedAt.toISOString(),
		};

		// Send notification emails safely in background
		Promise.allSettled([
			sendContactInquiryNotificationToAdmin(fullInquiry),
			sendContactInquiryConfirmationToUser(fullInquiry),
		]).catch((err) => {
			console.error("Error sending contact inquiry emails:", err);
		});

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/inquiries");
		return { success: true, id };
	} catch (err: any) {
		console.error("Failed to insert contact inquiry:", err);
		return { success: false, error: err.message || "Failed to submit enquiry" };
	}
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
	try {
		const rows = await db
			.select()
			.from(contactInquiry)
			.orderBy(desc(contactInquiry.createdAt));

		return rows.map((r) => ({
			id: r.id,
			fullName: r.fullName,
			email: r.email,
			phone: r.phone,
			registrationNumber: r.registrationNumber,
			message: r.message,
			status: (r.status as ContactInquiry["status"]) || "new",
			adminNotes: r.adminNotes,
			createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
			updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
		}));
	} catch (err) {
		console.error("Failed to fetch contact inquiries:", err);
		return [];
	}
}

export async function updateContactInquiryStatus(
	id: string,
	status: ContactInquiry["status"],
	adminNotes?: string,
) {
	try {
		await db
			.update(contactInquiry)
			.set({
				status,
				adminNotes: adminNotes !== undefined ? adminNotes : undefined,
				updatedAt: new Date(),
			})
			.where(eq(contactInquiry.id, id));

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/inquiries");
		return { success: true };
	} catch (err) {
		console.error("Failed to update contact inquiry status:", err);
		throw new Error("Failed to update status");
	}
}

export async function deleteContactInquiry(id: string) {
	try {
		await db.delete(contactInquiry).where(eq(contactInquiry.id, id));
		revalidatePath("/dashboard");
		revalidatePath("/dashboard/inquiries");
		return { success: true };
	} catch (err) {
		console.error("Failed to delete contact inquiry:", err);
		throw new Error("Failed to delete enquiry");
	}
}
