"use client";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ProfileUpdateFormType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, ChangeEvent } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ProfileUpdateForm, ProfileUpdateSchema } from "@/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileUpdateFormPage({
	user,
}: {
	user: ProfileUpdateFormType;
}) {
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(user.image || null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ProfileUpdateForm>({
		resolver: zodResolver(ProfileUpdateSchema),
		mode: "onSubmit",
		defaultValues: {
			name: user.name,
			email: user.email,
			image: user.image || undefined,
		},
	});

	async function handleProfileUpdate(data: ProfileUpdateForm) {
		let imageUrl = data.image;

		if (file) {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("image", file);
			const uploadRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const uploadData = await uploadRes.json();
			setIsUploading(false);

			if (!uploadRes.ok) {
				toast.error(uploadData.error || "Upload failed");
				return;
			}
			imageUrl = uploadData.url;
		}

		const promises = [
			authClient.updateUser({
				name: data.name,
				image: imageUrl,
			}),
		];

		if (data.email !== user.email && data.email) {
			promises.push(
				authClient.changeEmail({
					newEmail: data.email,
					callbackURL: "/",
				}),
			);
		}

		const res = await Promise.all(promises);

		const updateUserResult = res[0];
		const emailResult = res[1] ?? { error: false };

		if (updateUserResult.error) {
			toast.error(updateUserResult.error.message || "Failed to update profile");
		} else if (emailResult.error) {
			toast.error(emailResult.error.message || "Failed to change email");
		} else {
			if (data.email !== user.email) {
				toast.success("Verify your new email address to complete the change.");
			} else {
				toast.success("Profile updated successfully");
			}
			router.refresh();
		}
	}

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.size > 1024 * 1024) {
				toast.error("File size must be less than 1MB");
				return;
			}
			setFile(selectedFile);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(selectedFile);
		}
	};

	return (
		<form
			className="space-y-4"
			onSubmit={handleSubmit(handleProfileUpdate)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="name">Name</FieldLabel>
					<Input
						id="name"
						placeholder="Your name"
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">{errors.name.message}</p>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="Your email"
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
				</Field>
				<div className="flex flex-col gap-4 py-4">
					<h3 className="text-sm font-medium">Change Profile Picture</h3>
					<div className="h-20 w-20 relative group">
						<Avatar className="h-20 w-20 border-2 border-primary/10">
							<AvatarImage
								src={preview || ""}
								alt={user.name}
							/>
							<AvatarFallback className="text-2xl bg-primary/5">
								{user?.name?.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
							<Camera className="h-8 w-8" />
						</button>
					</div>
					<Input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleImageChange}
					/>
				</div>
				<Field>
					<Button
						type="submit"
						disabled={isSubmitting || isUploading}
						className="w-full">
						<LoadingSwap isLoading={isSubmitting || isUploading}>
							Update Profile
						</LoadingSwap>
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
