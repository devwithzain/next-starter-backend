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
import { useEffect, useRef, useState } from "react";
import { OTPSchema, OTPSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const [resendTimer, setResendTimer] = useState(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const {
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<OTPSchemaType>({
		resolver: zodResolver(OTPSchema),
		mode: "onSubmit",
		defaultValues: {
			email: email,
			otp: "",
		},
	});

	useEffect(() => {
		if (resendTimer > 0) {
			timerRef.current = setTimeout(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
		} else if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [resendTimer]);

	const onSubmit = async (data: OTPSchemaType) => {
		await authClient.emailOtp.verifyEmail(
			{
				email: data.email || email,
				otp: data.otp,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: async () => {
					toast.success("Email verified successfully");
					const callbackUrl = searchParams.get("callbackUrl");
					const destination =
						callbackUrl && callbackUrl.startsWith("/")
							? callbackUrl
							: "/dashboard/billing";
					router.push(destination);
				},
			},
		);
	};

	const handleResend = async () => {
		if (resendTimer > 0) return;
		toast.loading("Sending code...");
		await authClient.emailOtp.sendVerificationOtp(
			{
				email: email,
				type: "email-verification",
			},
			{
				onError: (error) => {
					toast.dismiss();
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					toast.dismiss();
					toast.success("Code resent successfully");
					setResendTimer(30);
				},
			},
		);
	};

	return (
		<div
			className={cn("w-full flex flex-col gap-4", className)}
			{...props}>
			<Card className="overflow-hidden p-0">
				<CardContent>
					<form
						className="p-6 md:py-8"
						onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-1 text-center">
								<h1 className="text-2xl font-bold">Enter verification code</h1>
								<p className="text-muted-foreground text-sm text-balance">
									We sent a 6-digit code to your email.
								</p>
							</div>
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
									containerClassName="gap-2 flex justify-center">
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
								{errors.otp && (
									<p className="text-red-500 text-sm">{errors.otp.message}</p>
								)}
								<FieldDescription className="text-center">
									Enter the 6-digit code sent to your email.
								</FieldDescription>
							</Field>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full">
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									</>
								) : (
									"Verify"
								)}
							</Button>
							<FieldDescription className="text-center">
								Didn&apos;t receive the code?{" "}
								<button
									type="button"
									className="cursor-pointer underline"
									onClick={handleResend}>
									{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
								</button>
							</FieldDescription>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
