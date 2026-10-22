"use client";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldDescription,
} from "@/components/ui/field";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Key, Lock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MagicLinkFormType, MagicLinkSchema } from "@/schemas";

export function MagicLinkForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSent, setIsSent] = useState(false);

	const form = useForm<MagicLinkFormType>({
		resolver: zodResolver(MagicLinkSchema),
		defaultValues: {
			email: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form;

	const handleSendMagicLink = async (data: MagicLinkFormType) => {
		await authClient.signIn.magicLink(
			{
				email: data.email,
				callbackURL: "/dashboard",
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Something went wrong");
				},
				onSuccess: () => {
					toast.success("Magic link sent successfully");
					setIsSent(true);
				},
			},
		);
	};

	if (isSent) {
		return (
			<Card className="overflow-hidden p-0">
				<CardContent className="w-full">
					<div className="p-6 md:py-8 flex flex-col items-center text-center gap-6">
						<div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
							<div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
								<Mail size={32} />
							</div>
						</div>

						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tight">
								An email is on its way!
							</h1>
							<p className="text-muted-foreground text-balance">
								We sent a magic link to your email. The link expires in 24
								hours, so be sure to use it soon.
							</p>
						</div>

						<div className="space-y-4 w-full">
							<div className="font-semibold text-lg">Go check your email!</div>

							<div className="pt-4 border-t w-full">
								<p className="text-sm text-muted-foreground mb-4">
									Want to sign in with another method?
								</p>
								<Button
									variant="link"
									className="text-primary p-0 h-auto font-semibold">
									<Link href="/sign-in">Login with Password</Link>
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<div
				className={cn("flex flex-col gap-6", className)}
				{...props}>
				<Card className="overflow-hidden p-0">
					<CardContent className="w-full">
						<form
							className="p-6 md:py-8"
							onSubmit={handleSubmit(handleSendMagicLink)}>
							<FieldGroup>
								<div className="flex flex-col items-center gap-2 text-center">
									<h1 className="text-2xl font-bold">
										Sign in with Magic Link
									</h1>
									<p className="text-muted-foreground text-balance">
										Enter your email to receive a magic link to sign in to
										your account.
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
										<p className="text-red-500 text-sm">
											{errors.email.message}
										</p>
									)}
								</Field>
								<div className="flex flex-col gap-3">
									<Button
										type="submit"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<Loader2 className="animate-spin mx-auto" />
										) : (
											"Send Magic Link"
										)}
									</Button>
									<Button
										type="button"
										variant="outline">
										<Link href="/sign-in">
											<div className="flex items-center gap-2">
												<Lock />
												Sign In with Password
											</div>
										</Link>
									</Button>
								</div>
								<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
									Or continue with
								</FieldSeparator>
								<div className="flex flex-col gap-3">
									<Field>
										<Button
											type="button"
											variant="outline">
											<div className="flex items-center gap-2">
												<Key />
												Sign In with Passkey
											</div>
										</Button>
									</Field>
									<FieldDescription className="text-center">
										Don&apos;t have an account? <a href="/sign-up">Sign up</a>
									</FieldDescription>
								</div>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
