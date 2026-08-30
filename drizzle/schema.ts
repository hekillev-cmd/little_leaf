import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const storeProducts = mysqlTable("storeProducts", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  price: varchar("price", { length: 32 }).notNull(),
  coverKey: varchar("coverKey", { length: 512 }).notNull(),
  coverUrl: varchar("coverUrl", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertStoreProduct = typeof storeProducts.$inferInsert;

export const storeOrders = mysqlTable("storeOrders", {
  id: int("id").autoincrement().primaryKey(),
  orderId: varchar("orderId", { length: 96 }).notNull().unique(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  amountUsd: varchar("amountUsd", { length: 32 }).notNull(),
  currency: varchar("currency", { length: 16 }).notNull().default("USD"),
  status: mysqlEnum("status", ["pending", "paid", "paid_over", "wrong_amount", "failed", "cancelled"]).notNull().default("pending"),
  invoiceUuid: varchar("invoiceUuid", { length: 96 }),
  invoiceUrl: varchar("invoiceUrl", { length: 512 }),
  itemsJson: text("itemsJson").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StoreOrder = typeof storeOrders.$inferSelect;
export type InsertStoreOrder = typeof storeOrders.$inferInsert;