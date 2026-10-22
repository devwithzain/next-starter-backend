import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { TwoFactorAuth } from "./_components/two-factor-auth";
import { AccountDeletion } from "./_components/account-deletion";
import { PasskeyManagement } from "./_components/passkey-management";
import { SessionManagement } from "./_components/session-management";
import { SetPasswordButton } from "./_components/set-password-button";
import { ProfileUpdateFormPage } from "./_components/profile-update-form";
import { ChangePasswordFormPage } from "./_components/change-password-form";

export default async function ProfilePage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (session == null) return redirect("/sign-in");

	return (
		<div className="w-full max-w-3xl px-4 py-8">
			<div className="space-y-12">
				<section>
					<h2 className="text-2xl font-bold mb-2">Profile</h2>
					<p className="text-muted-foreground mb-6">
						Update your personal information and profile details.
					</p>
					<div className="bg-background border rounded-lg p-6">
						<ProfileUpdateFormPage user={session.user} />
					</div>
				</section>
				<section>
					<h2 className="text-2xl font-bold mb-2">Security</h2>
					<p className="text-muted-foreground mb-6">
						Manage your password, two-factor authentication, and passkeys.
					</p>
					<LoadingSuspense>
						<SecurityTab
							email={session.user.email}
							isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
						/>
					</LoadingSuspense>
				</section>
				<section>
					<h2 className="text-2xl font-bold mb-2">Sessions</h2>
					<p className="text-muted-foreground mb-6">
						View and manage your active sessions across devices.
					</p>
					<LoadingSuspense>
						<SessionsTab currentSessionToken={session.session.token} />
					</LoadingSuspense>
				</section>
				<section className="border-t pt-12">
					<h2 className="text-2xl font-bold text-destructive mb-2">
						Danger Zone
					</h2>
					<p className="text-muted-foreground mb-6">
						Permanent actions that cannot be undone.
					</p>
					<div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
						<AccountDeletion />
					</div>
				</section>
			</div>
		</div>
	);
}

async function SessionsTab({
	currentSessionToken,
}: {
	currentSessionToken: string;
}) {
	const sessions = await auth.api.listSessions({ headers: await headers() });

	return (
		<div className="bg-background border rounded-lg p-6">
			<SessionManagement
				sessions={sessions}
				currentSessionToken={currentSessionToken}
			/>
		</div>
	);
}

async function SecurityTab({
	email,
	isTwoFactorEnabled,
}: {
	email: string;
	isTwoFactorEnabled: boolean;
}) {
	const [passkeys, accounts] = await Promise.all([
		auth.api.listPasskeys({ headers: await headers() }),
		auth.api.listUserAccounts({ headers: await headers() }),
	]);

	const hasPasswordAccount = accounts.some(
		(a) => a.providerId === "credential",
	);

	return (
		<div className="space-y-6">
			{hasPasswordAccount ? (
				<div className="bg-background border rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-2">Change Password</h3>
					<p className="text-sm text-muted-foreground mb-4">
						Update your password for improved security.
					</p>
					<ChangePasswordFormPage />
				</div>
			) : (
				<div className="bg-background border rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-2">Set Password</h3>
					<p className="text-sm text-muted-foreground mb-4">
						We will send you a password reset email to set up a password.
					</p>
					<SetPasswordButton email={email} />
				</div>
			)}

			{hasPasswordAccount && (
				<div className="bg-background border rounded-lg p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
						<span
							className={`text-xs px-2 py-1 rounded-full ${
								isTwoFactorEnabled
									? "bg-green-100 text-green-800"
									: "bg-gray-100 text-gray-800"
							}`}>
							{isTwoFactorEnabled ? "Enabled" : "Disabled"}
						</span>
					</div>
					<TwoFactorAuth isEnabled={isTwoFactorEnabled} />
				</div>
			)}

			<div className="bg-background border rounded-lg p-6">
				<h3 className="text-lg font-semibold mb-4">Passkeys</h3>
				<PasskeyManagement passkeys={passkeys} />
			</div>
		</div>
	);
}

function LoadingSuspense({ children }: { children: ReactNode }) {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center py-8">
					<Loader2Icon className="size-8 animate-spin text-muted-foreground" />
				</div>
			}>
			{children}
		</Suspense>
	);
}
