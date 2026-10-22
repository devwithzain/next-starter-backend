import {
  emailOTP,
  magicLink,
  twoFactor,
  lastLoginMethod,
  anonymous,
} from "better-auth/plugins";
import { sql } from "drizzle-orm";
import {
  sendWelcomeEmail,
  sendMagicLinkEmail,
  sendSignInOTPEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendDeleteAccountVerificationEmail,
} from "@/lib/emails/email-verification";
import { db } from "@/drizzle/db";
import { betterAuth } from "better-auth";
import * as schema from "@/drizzle/schema";
import { passkey } from "@better-auth/passkey";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin } from "better-auth/plugins/admin";

export const auth = betterAuth({
  appName: "Starter",
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema
  }),
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      await sendPasswordResetEmail({ user, token });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [
    passkey(),
    twoFactor(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const u = { email, name: email.split("@")[0] };
        try {
          if (type === "email-verification") {
            await sendEmailVerificationEmail({ user: u, token: otp });
          } else if (type === "forget-password") {
            await sendPasswordResetEmail({ user: u, token: otp });
          } else if (type === "sign-in") {
            await sendSignInOTPEmail({ user: u, token: otp });
          }
        } catch (e) {
          console.error("[email-otp sendVerificationOTP]", type, email, e);
          throw e;
        }
      },
      otpLength: 6,
      expiresIn: 600,
    }),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({
          user: { email, name: email.split("@")[0] },
          url,
        });
      },
    }),
    anonymous({
      emailDomainName: "guest.barrain.co.uk",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        try {
          await db.execute(sql`
						UPDATE user_favorites
						SET user_id = ${newUser.user.id}
						WHERE user_id = ${anonymousUser.user.id}
					`);
        } catch (err) {
          console.error("[anonymous onLinkAccount] favorites transfer error:", err);
        }
      },
    }),
    adminPlugin(),
    nextCookies(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/sign-up")) return;
      const newUser = ctx.context.newSession?.user ?? {
        name: ctx.body?.name,
        email: ctx.body?.email,
      };
      if (newUser?.email) {
        await new Promise((r) => setTimeout(r, 800));
        try {
          await sendWelcomeEmail(newUser);
        } catch (e) {
          ctx.context.logger?.error?.("[welcome-email]", e);
        }
      }
    }),
  },
});
