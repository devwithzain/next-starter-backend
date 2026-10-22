"use client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackupCodeForm, BackupCodeSchema } from "@/schemas";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function BackupCodeTab() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<BackupCodeForm>({
		resolver: zodResolver(BackupCodeSchema),
		mode: "onSubmit",
		defaultValues: {
			code: "",
		},
	});

	async function handleBackupCodeVerification(data: BackupCodeForm) {
		await authClient.twoFactor.verifyBackupCode(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to verify code");
			},
			onSuccess: () => {
				router.push("/");
			},
		});
	}

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit(handleBackupCodeVerification)}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-2 text-center">
					<h2 className="text-xl font-semibold">Backup Code</h2>
					<p className="text-muted-foreground text-sm text-balance">
						Enter one of your emergency backup codes
					</p>
				</div>
				<Field>
					<FieldLabel
						htmlFor="code"
						className="sr-only">
						Backup Code
					</FieldLabel>
					<Input
						id="code"
						placeholder="e.g. 1a2b3c4d5e"
						required
						{...register("code")}
					/>
					{errors.code && (
						<p className="text-red-500 text-sm">{errors.code.message}</p>
					)}
				</Field>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full">
						{isSubmitting ? (
							<Loader2 className="animate-spin mx-auto" />
						) : (
							"Verify Backup Code"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
