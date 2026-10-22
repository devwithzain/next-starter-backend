"use client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyOtpSchema, VerifyOtpSchemaType } from "@/schemas";

export function NewPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const otp = searchParams.get("otp") || "";
	const email = searchParams.get("email") || "";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<VerifyOtpSchemaType>({
		resolver: zodResolver(VerifyOtpSchema),
		mode: "onSubmit",
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: VerifyOtpSchemaType) => {
		await authClient.emailOtp.resetPassword(
			{
				email: email,
				otp: otp,
				password: data.password,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					toast.success("Password reset successfully!");
					router.push(`/sign-in`);
				},
			},
		);
	};

	return (
		<div
			className={cn(
				"w-full flex flex-col items-center justify-center gap-6 md:min-h-[600px]",
				className,
			)}
			{...props}>
			<Card className="w-full overflow-hidden p-0">
				<CardContent className="w-full">
					<form
						className="flex flex-col items-center justify-center p-6 md:py-8"
						onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field className="items-center text-center">
								<h1 className="text-2xl font-bold">Reset Your Password</h1>
								<p className="text-muted-foreground text-sm text-balance">
									Enter new password
								</p>
							</Field>
							<Field>
								<Input
									id="password"
									type="password"
									placeholder="Enter new password"
									required
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-red-500 text-sm">
										{errors.password.message}
									</p>
								)}
							</Field>
							<Field>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm new password"
									required
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm">
										{errors.confirmPassword.message}
									</p>
								)}
							</Field>
							<Field>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Set New Password"
									)}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
