import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/app/(auth)/reset-password/_components/reset-password-form";

export const metadata: Metadata = {
	title: "Reset Password — Starter",
	description: "Reset your Starter account password",
};

export default function ResetPassword() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ResetPasswordForm />
		</Suspense>
	);
}
