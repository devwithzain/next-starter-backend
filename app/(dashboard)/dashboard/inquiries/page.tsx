import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getContactInquiries } from "@/lib/actions/inquiries";
import { InquiryTable } from "./_components/inquiry-table";

export default async function InquiriesPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return redirect("/sign-in");

	const inquiries = await getContactInquiries();

	return (
		<div className="flex flex-col">
			<div className="flex flex-col px-4 lg:px-6 py-4 md:py-6">
				<h1 className="text-3xl text-black dark:text-white font-medium leading-tight">
					Customer Enquiries ({inquiries.length})
				</h1>
				<p className="text-base font-normal text-muted-foreground leading-tight">
					Review incoming messages, vehicle issues, and contact requests submitted through the website.
				</p>
			</div>
			<InquiryTable initialInquiries={inquiries} />
		</div>
	);
}
