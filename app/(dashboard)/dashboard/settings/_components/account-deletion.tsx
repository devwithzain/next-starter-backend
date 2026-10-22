"use client";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "@/components/action-button";

export function AccountDeletion() {
	return (
		<BetterAuthActionButton
			requireAreYouSure
			variant="destructive"
			className="w-full"
			successMessage="Account deletion initiated. Please check your email to confirm."
			action={() => authClient.deleteUser({ callbackURL: "/" })}>
			Delete Account Permanently
		</BetterAuthActionButton>
	);
}
