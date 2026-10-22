import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInForm } from "./_components/sign-in-form";

export const metadata: Metadata = {
	title: "Login — Starter",
	description: "Login to your Starter account",
};

export default async function SignInPage({
	searchParams,
}: {
	searchParams: Promise<{ callbackUrl?: string }>;
}) {
	const { callbackUrl: callbackUrlParam } = await searchParams;
	const session = await auth.api.getSession({ headers: await headers() });

	if (session) {
		const callbackUrl = callbackUrlParam || "/dashboard";
		return redirect(callbackUrl);
	}

	return <SignInForm callbackUrl={callbackUrlParam} />;
}
