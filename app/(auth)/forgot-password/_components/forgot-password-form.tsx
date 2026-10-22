"use client";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/schemas";

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordSchemaType>({
		resolver: zodResolver(ForgotPasswordSchema),
		mode: "onSubmit",
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordSchemaType) => {
		await authClient.emailOtp.requestPasswordReset(
			{
				email: data.email,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					toast.success("Reset code sent to your email!");
					router.push(
						`/reset-password?email=${encodeURIComponent(data.email)}`,
					);
				},
			},
		);
	};

	return (
		<div
			className={cn("w-full flex flex-col gap-6", className)}
			{...props}>
			<Card className="overflow-hidden p-0">
				<CardContent>
					<form
						className="p-6 md:py-8"
						onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Forgot Password</h1>
								<p className="text-muted-foreground text-balance">
									Enter your email to receive a 6-digit reset code
								</p>
							</div>
							<Field>
								<FieldLabel htmlFor="email">Email Address</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm">{errors.email.message}</p>
								)}
							</Field>
							<Field>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="animate-spin mx-auto" />
									) : (
										"Send Reset Code"
									)}
								</Button>
							</Field>
							<FieldDescription className="text-center">
								Remember your password? <a href="/sign-in">Sign in</a>
							</FieldDescription>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
