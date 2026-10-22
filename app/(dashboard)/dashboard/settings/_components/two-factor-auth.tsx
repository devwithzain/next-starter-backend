"use client";
import {
	QrForm,
	QrSchema,
	TwoFactorAuthForm,
	TwoFactorAuthSchema,
} from "@/schemas";
import {
	Field,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { useState } from "react";
import QRCode from "react-qr-code";
import { TwoFactorData } from "@/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSwap } from "@/components/ui/loading-swap";

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
	const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
		null,
	);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<TwoFactorAuthForm>({
		resolver: zodResolver(TwoFactorAuthSchema),
		mode: "onSubmit",
		defaultValues: { password: "" },
	});

	async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
		await authClient.twoFactor.disable(
			{
				password: data.password,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to disable 2FA");
				},
				onSuccess: () => {
					reset();
					router.refresh();
				},
			},
		);
	}

	async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
		const result = await authClient.twoFactor.enable({
			password: data.password,
		});

		if (result.error) {
			toast.error(result.error.message || "Failed to enable 2FA");
			return;
		}

		if (result.data && result.data.method === "totp") {
			setTwoFactorData({
				totpURI: result.data.totpURI,
				backupCodes: result.data.backupCodes,
			});
			reset();
		}
	}

	if (twoFactorData != null) {
		return (
			<QRCodeVerify
				{...twoFactorData}
				onDone={() => {
					setTwoFactorData(null);
				}}
			/>
		);
	}

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit(
				isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
			)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						type="password"
						placeholder="********"
						required
						autoComplete="current-password"
						{...register("password")}
					/>
					{errors.password && (
						<p className="text-red-500 text-sm">
							{errors.password.message}
						</p>
					)}
				</Field>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full"
						variant={isEnabled ? "destructive" : "default"}>
						<LoadingSwap isLoading={isSubmitting}>
							{isEnabled ? "Disable 2FA" : "Enable 2FA"}
						</LoadingSwap>
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}

function QRCodeVerify({
	totpURI,
	backupCodes,
	onDone,
}: TwoFactorData & { onDone: () => void }) {
	const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<QrForm>({
		resolver: zodResolver(QrSchema),
		mode: "onSubmit",
		defaultValues: { token: "" },
	});

	async function handleQrCode(data: QrForm) {
		await authClient.twoFactor.verifyTotp(
			{
				code: data.token,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to verify code");
				},
				onSuccess: () => {
					setSuccessfullyEnabled(true);
					router.refresh();
				},
			},
		);
	}

	if (successfullyEnabled) {
		return (
			<>
				<p className="text-sm text-muted-foreground mb-2">
					Save these backup codes in a safe place. You can use them to access
					your account.
				</p>
				<div className="grid grid-cols-2 gap-2 mb-4">
					{backupCodes.map((code, index) => (
						<div
							key={index}
							className="text-sm">
							{code}
						</div>
					))}
				</div>
				<Button
					variant="outline"
					onClick={onDone}>
					Done
				</Button>
			</>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Scan this QR code with your authenticator app and enter the code below:
			</p>
			<form
				className="space-y-4"
				onSubmit={handleSubmit(handleQrCode)}>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="token">Code</FieldLabel>
						<Input
							id="token"
							placeholder="Enter 6-digit code"
							required
							{...register("token")}
						/>
						{errors.token && (
							<p className="text-red-500 text-sm">
								{errors.token.message}
							</p>
						)}
					</Field>
					<Field>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full">
							<LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<div className="p-4 bg-white w-fit">
				<QRCode
					size={256}
					value={totpURI}
				/>
			</div>
		</div>
	);
}

