"use client";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/schemas";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { isSubmitting },
	} = useForm<ResetPasswordSchemaType>({
		resolver: zodResolver(ResetPasswordSchema),
		mode: "onSubmit",
		defaultValues: {
			otp: "",
		},
	});

	const onSubmit = async (data: ResetPasswordSchemaType) => {
		await authClient.emailOtp.checkVerificationOtp(
			{
				email: email,
				otp: data.otp,
				type: "forget-password",
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					router.push(
						`/new-password?email=${encodeURIComponent(email)}&otp=${data.otp}`,
					);
				},
			},
		);
	};

	const handleResend = async () => {
		await authClient.emailOtp.requestPasswordReset(
			{ email: email },
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					toast.success("Reset code sent to your email!");
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
				<CardContent>
					<form
						className="flex flex-col items-center justify-center p-6 md:py-8"
						onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field className="items-center text-center">
								<h1 className="text-2xl font-bold">Reset Your Password</h1>
								<p className="text-muted-foreground text-sm text-balance">
									Enter the 6-digit code sent to {email}
								</p>
							</Field>
							<Field>
								<FieldLabel
									htmlFor="otp"
									className="sr-only">
									Verification code
								</FieldLabel>
								<InputOTP
									maxLength={6}
									id="otp"
									value={watch("otp")}
									onChange={(value) => setValue("otp", value)}
									required
									containerClassName="gap-4 flex justify-center">
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
									</InputOTPGroup>
									<InputOTPSeparator />
									<InputOTPGroup>
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
								<FieldDescription className="text-center">
									Enter the 6-digit code sent to your email.
								</FieldDescription>
							</Field>
							<Field>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Reset Password"
									)}
								</Button>
								<FieldDescription className="text-center">
									Didn&apos;t receive the code?{" "}
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											handleResend();
										}}>
										Resend
									</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
