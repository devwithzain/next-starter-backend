import { Metadata } from "next";
import { SignUpForm } from "@/app/(auth)/sign-up/_components/sign-up-form";

export const metadata: Metadata = {
	title: "Sign Up — Starter",
	description: "Sign up to your Starter account",
};

export default async function SignupPage({
	searchParams,
}: {
	searchParams: Promise<{ callbackUrl?: string }>;
}) {
	const { callbackUrl } = await searchParams;
	return <SignUpForm callbackUrl={callbackUrl} />;
}
