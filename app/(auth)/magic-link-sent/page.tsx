import { Metadata } from "next";
import { MagicLinkForm } from "@/app/(auth)/magic-link-sent/_components/magic-link-form";

export const metadata: Metadata = {
	title: "Magic Link Sent — Starter",
	description: "Check your email for a magic link to login to your account",
};

export default function MagicLinkSentPage() {
	return <MagicLinkForm />;
}
