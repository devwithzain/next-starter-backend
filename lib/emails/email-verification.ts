import { transporter } from "../mailer";
import { TmailData, TmailTokenData } from "@/types";

const emailFooter = `
	<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 15px 0;" />
	<p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 0;">
		Starter Tanning & Wellness Services. This is an automated security notification. 
		If you did not make this request or need assistance, please contact our support team at 
		<a href="mailto:support@demo-weblink.com" style="color: #007947; text-decoration: none;">support@demo-weblink.com</a>.
	</p>
`;

export async function sendEmailVerificationEmail({
	user,
	token,
}: TmailTokenData) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Your Starter Account Verification Code",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Verify your email address</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>Thank you for creating an account with Starter</p>
        <p>To secure your account and complete your sign-up process, please enter the following 6-digit verification code on the registration page:</p>
        <div style="background-color: #f3f4f6; color: #111827; border: 1px solid #e5e7eb; padding: 12px 24px; border-radius: 4px; display: inline-block; margin: 16px 0; font-size: 24px; font-weight: 700; letter-spacing: 4px;">${token}</div>
        <p style="font-size: 14px; color: #6b7280;">This code is temporary and will expire in 10 minutes. If you did not sign up for a Starter account, you can safely ignore this email.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nThank you for signing up with Starter!\n\nYour verification code is: ${token}\n\nThis code expires in 10 minutes. If you didn't create an account, ignore this email.\n`,
	});
}

export async function sendPasswordResetEmail({ user, token }: TmailTokenData) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Reset your Starter Password",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Reset your password</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>We received a request to reset the password for your Starter account.</p>
        <p>Please enter the following 6-digit verification code on the password reset page to choose a new password:</p>
        <div style="background-color: #eff6ff; color: #1e3a8a; border: 1px solid #bfdbfe; padding: 12px 24px; border-radius: 4px; display: inline-block; margin: 16px 0; font-size: 24px; font-weight: 700; letter-spacing: 4px;">${token}</div>
        <p style="font-size: 14px; color: #6b7280;">If you did not request a password reset, please ignore this email or reach out to support if you suspect unauthorized access.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nWe received a password reset request for your Starter account.\n\nYour reset code is: ${token}\n\nIf you did not request this, ignore this email.\n`,
	});
}

export async function sendDeleteAccountVerificationEmail({
	user,
	url,
}: TmailData) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Confirm your Starter Account Deletion",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">Confirm account deletion</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>We received a request to permanently delete your Starter account. This action will erase your account details and any remaining tanning minutes.</p>
        <p>If you are sure you want to proceed, please click the confirmation button below:</p>
        <a href="${url}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0; font-weight: 600;">Confirm Deletion</a>
        <p style="font-size: 14px; color: #6b7280;">If you did not request this deletion, please contact support immediately to secure your account.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nWe received a request to delete your Starter account.\n\nConfirm deletion by visiting: ${url}\n`,
	});
}

export async function sendWelcomeEmail(user: { name: string; email: string; }) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Welcome to Starter!",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Welcome</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>Thanks for signing up with Starter</p>
        <p>If you haven't done so already, please check your mailbox for your 6-digit verification code to activate your account.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nThanks for signing up with Starter! Make sure to verify your account using the 6-digit code sent to your email.\n`,
	});
}

export function sendEmail({
	to,
	subject,
	html,
	text,
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) {
	return transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to,
		subject,
		html,
		text,
	});
}

export async function sendSignInOTPEmail({ user, token }: TmailTokenData) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Your Starter Sign-In Verification Code",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Verify your sign-in</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>We received a request to log in to your Starter account using a verification code.</p>
        <p>Please enter the following 6-digit code on the verification page to complete your login:</p>
        <div style="background-color: #f3f4f6; color: #111827; border: 1px solid #e5e7eb; padding: 12px 24px; border-radius: 4px; display: inline-block; margin: 16px 0; font-size: 24px; font-weight: 700; letter-spacing: 4px;">${token}</div>
        <p style="font-size: 14px; color: #6b7280;">If you did not request this login, please ignore this email.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nYour sign-in verification code is: ${token}\n`,
	});
}

export async function sendMagicLinkEmail({ user, url }: TmailData) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Your Starter Sign-In Link",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151; line-height: 1.6;">
        <h2 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">Sign in to Starter</h2>
        <p>Hello ${user?.name || "User"},</p>
        <p>Click the link below to securely sign in to your Starter account:</p>
        <a href="${url}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0; font-weight: 600;">Sign In</a>
        <p style="font-size: 14px; color: #6b7280;">If you did not request a sign-in link, you can safely ignore this email.</p>
        ${emailFooter}
      </div>
    `,
		text: `Hello ${user.name || "User"},\n\nUse this link to sign in: ${url}\n`,
	});
}

export async function sendSubscriptionSuccessEmail({
	user,
	plan,
}: {
	user: { name: string; email: string; };
	plan: string;
}) {
	await transporter.sendMail({
		from: `"Starter" <${process.env.SMTP_USER}>`,
		to: user.email,
		subject: "Subscription Successful!",
		html: `
      <div style="font-family: system-ui, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111;">Subscription Confirmed</h2>
        <p>Hello ${user?.name},</p>
        <p>You have successfully subscribed to the <strong>${plan}</strong> plan.</p>
        <p>Your new image generation limits have been applied. Start creating now!</p>
        <a href="${process.env.BETTER_AUTH_URL}/dashboard/generate" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Go to Dashboard</a>
      </div>
    `,
		text: `Hello ${user.name || "there"},\n\nYour subscription to the ${plan} plan is successful!\n`,
	});
}
