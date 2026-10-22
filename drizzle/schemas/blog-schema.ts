import {
   mysqlTable,
   text,
   longtext,
   varchar,
   boolean,
   timestamp,
   datetime,
} from "drizzle-orm/mysql-core";

export const blogsTable = mysqlTable("blogs", {
   id: varchar("id", { length: 36 }).primaryKey(),
   title: varchar("title", { length: 255 }).notNull(),
   slug: varchar("slug", { length: 255 }).notNull().unique(),
   excerpt: text("excerpt"),
   content: longtext("content").notNull(),
   coverImage: text("cover_image"),
   category: varchar("category", { length: 128 }).notNull().default("Market Insights"),
   author: varchar("author", { length: 128 }).notNull().default("Barrain London"),
   readTime: varchar("read_time", { length: 64 }).default("3 min read"),
   status: varchar("status", { length: 32 }).$type<"draft" | "published" | "archived">().notNull().default("draft"),
   featured: boolean("featured").default(false),
   publishedAt: datetime("published_at"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const blogCommentsTable = mysqlTable("blog_comments", {
   id: varchar("id", { length: 36 }).primaryKey(),
   blogSlug: varchar("blog_slug", { length: 255 }).notNull(),
   name: varchar("name", { length: 255 }).notNull(),
   email: varchar("email", { length: 255 }).notNull(),
   content: text("content").notNull(),
   status: varchar("status", { length: 32 }).$type<"approved" | "pending" | "spam">().notNull().default("approved"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogRecord = typeof blogsTable.$inferSelect;
export type NewBlogRecord = typeof blogsTable.$inferInsert;
export type BlogCommentRecord = typeof blogCommentsTable.$inferSelect;
export type NewBlogCommentRecord = typeof blogCommentsTable.$inferInsert;
