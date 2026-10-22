import { Metadata } from "next";
import { ForgotPasswordForm } from "@/app/(auth)/forgot-password/_components/forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot Password — Starter",
	description: "Reset your Starter account password",
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}
