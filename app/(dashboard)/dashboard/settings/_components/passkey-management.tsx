"use client";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Passkey } from "@better-auth/passkey";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasskeyForm, PasskeySchema } from "@/schemas";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { BetterAuthActionButton } from "@/components/action-button";

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<PasskeyForm>({
		resolver: zodResolver(PasskeySchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
		},
	});

	async function handleAddPasskey(data: PasskeyForm) {
		await authClient.passkey.addPasskey(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to add passkey");
			},
			onSuccess: () => {
				router.refresh();
				setIsDialogOpen(false);
			},
		});
	}
	function handleDeletePasskey(passkeyId: string) {
		return authClient.passkey.deletePasskey(
			{ id: passkeyId },
			{ onSuccess: () => router.refresh() },
		);
	}

	return (
		<div className="space-y-6">
			{passkeys.length === 0 ? (
				<Card>
					<CardHeader>
						<CardTitle>No passkeys yet</CardTitle>
						<CardDescription>
							Add your first passkey for secure, passwordless authentication.
						</CardDescription>
					</CardHeader>
				</Card>
			) : (
				<div className="space-y-4">
					{passkeys.map((passkey) => (
						<Card key={passkey.id}>
							<CardHeader className="flex gap-2 items-center justify-between">
								<div className="space-y-1">
									<CardTitle>{passkey.name}</CardTitle>
									<CardDescription>
										Created {new Date(passkey.createdAt).toLocaleDateString()}
									</CardDescription>
								</div>
								<BetterAuthActionButton
									requireAreYouSure
									variant="destructive"
									size="icon"
									action={() => handleDeletePasskey(passkey.id)}>
									<Trash2 />
								</BetterAuthActionButton>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
			<Dialog
				open={isDialogOpen}
				onOpenChange={(o) => {
					if (o) reset();
					setIsDialogOpen(o);
				}}>
				<DialogTrigger>
					<Button>New Passkey</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Passkey</DialogTitle>
						<DialogDescription>
							Create a new passkey for secure, passwordless authentication.
						</DialogDescription>
					</DialogHeader>
					<form
						className="space-y-4"
						onSubmit={handleSubmit(handleAddPasskey)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="passkeyName">Name</FieldLabel>
								<Input
									id="passkeyName"
									placeholder="e.g. My MacBook"
									required
									{...register("name")}
								/>
								{errors.name && (
									<p className="text-red-500 text-sm">{errors.name.message}</p>
								)}
							</Field>
							<Field>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full">
									<LoadingSwap isLoading={isSubmitting}>Add</LoadingSwap>
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
