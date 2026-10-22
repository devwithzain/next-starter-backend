import { Suspense } from "react";
import { OTPForm } from "@/app/(auth)/verify-email/_components/otp-form";

export default async function VerifyEmail({
	searchParams,
}: {
	searchParams: Promise<{ email?: string; callbackUrl?: string }>;
}) {
	await searchParams;
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<OTPForm />
		</Suspense>
	);
}
