"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldDescription,
} from "@/components/ui/field";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Key } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { SigninSchema, SigninSchemaType } from "@/schemas";

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {
	callbackUrl?: string;
}

export function SignInForm({
	className,
	callbackUrl,
	...props
}: SignInFormProps) {
	const router = useRouter();
	const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SigninSchemaType>({
		resolver: zodResolver(SigninSchema),
		mode: "onSubmit",
	});

	useEffect(() => {
		const setupConditionalUI = async () => {
			if (
				typeof window !== "undefined" &&
				window.PublicKeyCredential &&
				PublicKeyCredential.isConditionalMediationAvailable
			) {
				const available =
					await PublicKeyCredential.isConditionalMediationAvailable();
				if (available) {
					try {
						await authClient.signIn.passkey(
							{ autoFill: true },
							{
								onSuccess(ctx) {
									toast.success("Signed in with passkey");
									const userRole = ctx.data?.user?.role;
									if (userRole === "admin") {
										router.push("/dashboard");
									} else {
										router.push("/");
									}
									router.refresh();
								},
								onError(ctx) {
									console.log(
										"Autofill passkey not available:",
										ctx.error.message,
									);
								},
							},
						);
					} catch (err) {
						console.log("Conditional UI setup failed:", err);
					}
				}
			}
		};

		setupConditionalUI();
	}, [router]);

	const onSubmit = async (data: SigninSchemaType) => {
		await authClient.signIn.email(
			{
				email: data.email.toLowerCase(),
				password: data.password,
			},
			{
				onError: async (error) => {
					const errorCode = error.error?.code;
					const errorMessage = error.error?.message ?? "";

					const isEmailNotVerified =
						errorCode === "EMAIL_NOT_VERIFIED" ||
						errorMessage.toLowerCase().includes("email not verified");
					if (isEmailNotVerified) {
						try {
							await authClient.emailOtp.sendVerificationOtp({
								email: data.email,
								type: "email-verification",
							});
							toast.info(
								"Your email is not verified. We've sent you a new verification code.",
							);
							router.push(
								`/verify-email?email=${encodeURIComponent(data.email)}`,
							);
						} catch (sendErr) {
							if (sendErr instanceof Error) {
								toast.error(sendErr.message);
							} else {
								toast.error(
									"Could not resend verification code. Please try again.",
								);
							}
						}
						return;
					}
					toast.error(errorMessage || "Something went wrong");
				},
				onSuccess: (ctx) => {
					toast.success("Login successful");
					const userRole = ctx.data?.user?.role;
					if (userRole === "admin") {
						router.push("/dashboard");
					} else {
						router.push(callbackUrl || "/");
					}
					router.refresh();
				},
			},
		);
	};

	const handlePasskeySignIn = async () => {
		setIsPasskeyLoading(true);
		try {
			await authClient.signIn.passkey(
				{
					autoFill: false,
				},
				{
					onSuccess(ctx) {
						toast.success("Signed in with passkey");
						const userRole = ctx.data?.user?.role;
						if (userRole === "admin") {
							router.push("/dashboard");
						} else {
							router.push("/");
						}
						router.refresh();
					},
					onError(ctx) {
						toast.error(ctx.error.message ?? "Passkey sign-in failed");
					},
				},
			);
		} catch (err) {
			console.error("Passkey sign-in error:", err);
			toast.error("Something went wrong with passkey authentication");
		} finally {
			setIsPasskeyLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div
				className={cn("flex flex-col gap-6", className)}
				{...props}>
				<Card className="overflow-hidden p-0">
					<CardContent className="w-full">
						<form
							className="p-6 md:py-8"
							onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="text-2xl font-bold">Welcome back</h1>
									<p className="text-muted-foreground text-balance">
										Login to your Starter account
									</p>
								</div>
								<Field>
									<FieldLabel htmlFor="email">Email Address</FieldLabel>
									<Input
										id="email"
										type="email"
										placeholder="m@example.com"
										required
										autoComplete="username webauthn"
										{...register("email")}
									/>
									{errors.email && (
										<p className="text-red-500 text-sm">
											{errors.email.message}
										</p>
									)}
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										id="password"
										type="password"
										placeholder="********"
										required
										autoComplete="current-password webauthn"
										{...register("password")}
									/>
									{errors.password && (
										<p className="text-red-500 text-sm">
											{errors.password.message}
										</p>
									)}
									<div className="flex items-center">
										<a
											href="/forgot-password"
											className="ml-auto text-sm underline-offset-2 hover:underline">
											Forgot your password?
										</a>
									</div>
								</Field>
								<div className="flex flex-col gap-3">
									<Field>
										<Button
											type="submit"
											disabled={isSubmitting}>
											{isSubmitting ? (
												<Loader2 className="animate-spin mx-auto" />
											) : (
												"Login"
											)}
										</Button>
									</Field>
									<Field>
										<Button
											type="button"
											variant="outline">
											<Link href="/magic-link-sent">
												<div className="flex items-center gap-2">
													<Mail />
													Sign In with Magic Link
												</div>
											</Link>
										</Button>
									</Field>
									<Field>
										<Button
											type="button"
											variant="outline"
											disabled={isPasskeyLoading}
											onClick={handlePasskeySignIn}>
											<div className="flex items-center gap-2">
												{isPasskeyLoading ? (
													<Loader2 className="animate-spin" />
												) : (
													<Key />
												)}
												Sign In with Passkey
											</div>
										</Button>
									</Field>
								</div>
								<FieldDescription className="text-center">
									Don&apos;t have an account?{" "}
									<Link
										href={`/sign-up${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}>
										Sign up
									</Link>
								</FieldDescription>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
