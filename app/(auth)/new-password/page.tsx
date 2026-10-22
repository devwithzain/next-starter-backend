import { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordForm } from "@/app/(auth)/new-password/_components/new-password-form";

export const metadata: Metadata = {
	title: "New Password — Starter",
	description: "Set a new password for your Starter account",
};

export default function NewPasswordPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NewPasswordForm />
		</Suspense>
	);
}
