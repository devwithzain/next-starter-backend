import {
	text,
	index,
	mysqlTable,
	varchar,
	boolean,
	int,
	timestamp,
	datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/_relations";

export const user = mysqlTable("user", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.onUpdateNow()
		.notNull(),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	role: varchar("role", { length: 64 }),
	lastLoginMethod: varchar("last_login_method", { length: 64 }),
	banned: boolean("banned").default(false),
	banReason: text("ban_reason"),
	banExpires: datetime("ban_expires"),
	isAnonymous: boolean("is_anonymous").default(false),
});

export const session = mysqlTable("session", {
	id: varchar("id", { length: 36 }).primaryKey(),
	expiresAt: datetime("expires_at").notNull(),
	token: varchar("token", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.onUpdateNow()
		.notNull(),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	impersonatedBy: text("impersonated_by"),
	userId: varchar("user_id", { length: 36 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
	id: varchar("id", { length: 36 }).primaryKey(),
	accountId: varchar("account_id", { length: 255 }).notNull(),
	providerId: varchar("provider_id", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 36 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: datetime("access_token_expires_at"),
	refreshTokenExpiresAt: datetime("refresh_token_expires_at"),
	scope: text("scope"),
	issuer: varchar("issuer", { length: 255 }).default("barrain"),
	password: text("password"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.onUpdateNow()
		.notNull(),
});

export const verification = mysqlTable("verification", {
	id: varchar("id", { length: 36 }).primaryKey(),
	identifier: varchar("identifier", { length: 255 }).notNull(),
	value: text("value").notNull(),
	expiresAt: datetime("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.onUpdateNow()
		.notNull(),
});

export const twoFactor = mysqlTable(
	"two_factor",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		secret: varchar("secret", { length: 255 }).notNull(),
		backupCodes: text("backup_codes").notNull(),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		verified: boolean("verified").default(true),
		failedVerificationCount: int("failed_verification_count").default(0),
		lockedUntil: datetime("locked_until"),
	},
	(table) => [
		index("twoFactor_secret_idx").on(table.secret),
		index("twoFactor_userId_idx").on(table.userId),
	],
);

export const passkey = mysqlTable("passkey", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }),
	publicKey: text("public_key").notNull(),
	userId: varchar("user_id", { length: 36 })
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	credentialID: varchar("credential_id", { length: 255 }).notNull(),
	counter: int("counter").notNull(),
	deviceType: varchar("device_type", { length: 64 }).notNull(),
	backedUp: boolean("backed_up").notNull(),
	transports: text("transports"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	aaguid: varchar("aaguid", { length: 64 }),
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	passkeys: many(passkey),
	twoFactors: many(twoFactor),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id],
	}),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id],
	}),
}));