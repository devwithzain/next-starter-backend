import * as z from "zod";

const passwordRules = z
	.string()
	.min(8, { message: "Password must be at least 8 characters" })
	.regex(/[A-Z]/, {
		message: "Password must contain at least one uppercase letter",
	})
	.regex(/[a-z]/, {
		message: "Password must contain at least one lowercase letter",
	})
	.regex(/[0-9]/, { message: "Password must contain at least one number" })
	.regex(/[^A-Za-z0-9]/, {
		message: "Password must contain at least one symbol",
	});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	email: z.string(),
	role: z.string().optional(),
	createdAt: z.date().or(z.string()),
	emailVerified: z.boolean(),
	banned: z.boolean(),
	image: z.string().nullable().optional(),
});

export const SigninSchema = z.object({
	email: z.email({ message: "A valid email is required." }),
	password: z.string().min(1, { message: "Password is required." }),
});

export const SignupSchema = z
	.object({
		name: z.string().min(1, { message: "Name is required." }),
		email: z.email({ message: "A valid email is required." }),
		password: passwordRules,
		confirmPassword: z.string().min(8, "Confirm password must match"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

export const OTPSchema = z.object({
	email: z.email({ message: "A valid email is required." }),
	otp: z.string().min(6, { message: "OTP is required." }),
});

export const ForgotPasswordSchema = z.object({
	email: z.email({ message: "A valid email is required." }),
});

export const ResetPasswordSchema = z.object({
	otp: z.string().min(6, { message: "OTP is required." }),
});

export const VerifyOtpSchema = z
	.object({
		password: passwordRules,
		confirmPassword: z.string().min(8, "Confirm password must match"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"],
	});

export const TwoFactorAuthSchema = z.object({
	password: z.string().min(1),
});

export const QrSchema = z.object({
	token: z.string().length(6),
});

export const ProfileUpdateSchema = z.object({
	name: z.string().optional(),
	email: z.email().optional(),
	image: z.string().optional(),
});

export const PasskeySchema = z.object({
	name: z.string().min(1),
});

export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: passwordRules,
	revokeOtherSessions: z.boolean(),
});

export const TotpSchema = z.object({
	code: z.string().length(6),
});

export const BackupCodeSchema = z.object({
	code: z.string().min(1),
});

export const MagicLinkSchema = z.object({
	email: z.email(),
});

export const VehicleSchema = z.object({
	id: z.string(),
	userId: z.string().optional().nullable(),
	registration: z.string().min(1, "Registration is required"),
	make: z.string().min(1, "Make is required"),
	model: z.string().min(1, "Model is required"),
	year: z.number().int().optional().nullable(),
	engineSize: z.string().optional().nullable(),
	fuelType: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	createdAt: z.date().or(z.string()).optional(),
	updatedAt: z.date().or(z.string()).optional(),
});

export const AutoServiceSchema = z.object({
	id: z.string(),
	title: z.string().min(1, "Title is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().optional().nullable(),
	price: z.string().or(z.number()),
	isPlusParts: z.boolean().default(false),
	category: z.string().default("Maintenance"),
	icon: z.string().default("fa-wrench"),
	durationMinutes: z.number().int().default(60),
	isActive: z.boolean().default(true),
	createdAt: z.date().or(z.string()).optional(),
	updatedAt: z.date().or(z.string()).optional(),
});

export const MechanicSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	email: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	specialty: z.string().optional().nullable(),
	isActive: z.boolean().default(true),
	createdAt: z.date().or(z.string()).optional(),
});

export const AppointmentStatusEnum = z.enum([
	"pending",
	"confirmed",
	"in_progress",
	"completed",
	"cancelled",
]);

export const PaymentStatusEnum = z.enum([
	"pending",
	"paid",
	"refunded",
	"failed",
]);

export const AppointmentSchema = z.object({
	id: z.string(),
	bookingReference: z.string(),
	userId: z.string().optional().nullable(),
	customerName: z.string().min(1, "Customer name is required"),
	customerEmail: z.string().email("Valid email is required"),
	customerPhone: z.string().optional().nullable(),
	vehicleId: z.string().optional().nullable(),
	vehicleSummary: z.string().optional().nullable(),
	mechanicId: z.string().optional().nullable(),
	postcode: z.string().min(1, "Postcode is required"),
	serviceLocation: z.string().optional().nullable(),
	scheduledDate: z.string().min(1, "Date is required"),
	scheduledTime: z.string().min(1, "Time is required"),
	status: AppointmentStatusEnum.default("pending"),
	callOutFee: z.string().or(z.number()).default("15.00"),
	subtotalAmount: z.string().or(z.number()),
	totalAmount: z.string().or(z.number()),
	paymentStatus: PaymentStatusEnum.default("pending"),
	paymentMethod: z.string().default("stripe"),
	stripePaymentIntentId: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
	createdAt: z.date().or(z.string()).optional(),
	updatedAt: z.date().or(z.string()).optional(),
	services: z.array(z.string()).optional(),
});

export const UpdateAppointmentStatusSchema = z.object({
	appointmentId: z.string(),
	status: AppointmentStatusEnum,
});

export type User = z.infer<typeof UserSchema>;
export type QrForm = z.infer<typeof QrSchema>;
export type TotpForm = z.infer<typeof TotpSchema>;
export type Vehicle = z.infer<typeof VehicleSchema>;
export type Mechanic = z.infer<typeof MechanicSchema>;
export type OTPSchemaType = z.infer<typeof OTPSchema>;
export type PasskeyForm = z.infer<typeof PasskeySchema>;
export type SigninSchemaType = z.infer<typeof SigninSchema>;
export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type AutoService = z.infer<typeof AutoServiceSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type BackupCodeForm = z.infer<typeof BackupCodeSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type MagicLinkFormType = z.infer<typeof MagicLinkSchema>;
export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;
export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
export type TwoFactorAuthForm = z.infer<typeof TwoFactorAuthSchema>;
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

