"use client";
import {
	Field,
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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { type TotpForm, TotpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

export function TotpForm() {
	const router = useRouter();
	const {
		handleSubmit,
		setValue,
		watch,
		formState: { isSubmitting },
	} = useForm<TotpForm>({
		resolver: zodResolver(TotpSchema),
		mode: "onSubmit",
		defaultValues: {
			code: "",
		},
	});

	async function handleTotpVerification(data: TotpForm) {
		await authClient.twoFactor.verifyTotp(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to verify code");
			},
			onSuccess: () => {
				router.push("/dashboard");
			},
		});
	}

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit(handleTotpVerification)}>
			<FieldGroup>
				<div className="flex flex-col items-center gap-2 text-center">
					<h2 className="text-xl font-semibold">Authenticator App</h2>
					<p className="text-muted-foreground text-sm text-balance">
						Enter the 6-digit code from your authenticator app
					</p>
				</div>
				<Field>
					<FieldLabel
						htmlFor="code"
						className="sr-only">
						Authentication code
					</FieldLabel>
					<InputOTP
						maxLength={6}
						id="code"
						value={watch("code")}
						onChange={(value) => setValue("code", value)}
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
				</Field>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full">
						{isSubmitting ? (
							<Loader2 className="animate-spin mx-auto" />
						) : (
							"Verify Code"
						)}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
