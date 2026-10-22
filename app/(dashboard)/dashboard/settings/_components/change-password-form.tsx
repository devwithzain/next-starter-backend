"use client";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ChangePasswordForm, ChangePasswordSchema } from "@/schemas";

export function ChangePasswordFormPage() {
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ChangePasswordForm>({
		resolver: zodResolver(ChangePasswordSchema),
		mode: "onSubmit",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			revokeOtherSessions: true,
		},
	});

	async function handlePasswordChange(data: ChangePasswordForm) {
		await authClient.changePassword(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to change password");
			},
			onSuccess: () => {
				toast.success("Password changed successfully");
				reset();
			},
		});
	}

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit(handlePasswordChange)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
					<Input
						id="currentPassword"
						type="password"
						placeholder="********"
						required
						autoComplete="current-password"
						{...register("currentPassword")}
					/>
					{errors.currentPassword && (
						<p className="text-red-500 text-sm">
							{errors.currentPassword.message}
						</p>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor="newPassword">New Password</FieldLabel>
					<Input
						id="newPassword"
						type="password"
						placeholder="********"
						required
						autoComplete="new-password"
						{...register("newPassword")}
					/>
					{errors.newPassword && (
						<p className="text-red-500 text-sm">{errors.newPassword.message}</p>
					)}
				</Field>
				<Controller
					control={control}
					name="revokeOtherSessions"
					render={({ field }) => (
						<Field orientation="horizontal">
							<Checkbox
								id="revokeOtherSessions"
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							<FieldLabel htmlFor="revokeOtherSessions">
								Log out other sessions
							</FieldLabel>
						</Field>
					)}
				/>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full">
						<LoadingSwap isLoading={isSubmitting}>Change Password</LoadingSwap>
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
