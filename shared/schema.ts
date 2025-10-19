import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
  date,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  mobileNumber: text("mobile_number"),
  fullName: text("full_name").notNull(),
  firstName: text("first_name").notNull(),
  shortName: text("short_name"),
  role: text("role").notNull().default("standard"), // 'admin' | 'standard'
  createdOn: timestamp("created_on").notNull().defaultNow(),
  lastLoggedOn: timestamp("last_logged_on"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdOn: true,
  lastLoggedOn: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Expense Categories
export const expenseCategories = pgTable("expense_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  color: text("color"), // For UI display
  createdOn: timestamp("created_on").notNull().defaultNow(),
});

export const insertExpenseCategorySchema = createInsertSchema(
  expenseCategories
).omit({
  id: true,
  createdOn: true,
});

export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;

// Expense Subcategories
export const expenseSubcategories = pgTable("expense_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id")
    .notNull()
    .references(() => expenseCategories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdOn: timestamp("created_on").notNull().defaultNow(),
});

export const insertExpenseSubcategorySchema = createInsertSchema(
  expenseSubcategories
).omit({
  id: true,
  createdOn: true,
});

export type InsertExpenseSubcategory = z.infer<
  typeof insertExpenseSubcategorySchema
>;
export type ExpenseSubcategory = typeof expenseSubcategories.$inferSelect;

// Payment Modes
export const paymentModes = pgTable("payment_modes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdOn: timestamp("created_on").notNull().defaultNow(),
});

export const insertPaymentModeSchema = createInsertSchema(paymentModes).omit({
  id: true,
  createdOn: true,
});

export type InsertPaymentMode = z.infer<typeof insertPaymentModeSchema>;
export type PaymentMode = typeof paymentModes.$inferSelect;

// Made For Entities
export const madeForEntities = pgTable("made_for_entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdOn: timestamp("created_on").notNull().defaultNow(),
});

export const insertMadeForEntitySchema = createInsertSchema(
  madeForEntities
).omit({
  id: true,
  createdOn: true,
});

export type InsertMadeForEntity = z.infer<typeof insertMadeForEntitySchema>;
export type MadeForEntity = typeof madeForEntities.$inferSelect;

// Years
export const years = pgTable("years", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  createdOn: timestamp("created_on").notNull().defaultNow(),
  updatedOn: timestamp("updated_on").notNull().defaultNow(),
});

export const insertYearSchema = createInsertSchema(years).omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type InsertYear = z.infer<typeof insertYearSchema>;
export type Year = typeof years.$inferSelect;

// Months
export const months = pgTable("months", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  yearId: varchar("year_id")
    .notNull()
    .references(() => years.id, { onDelete: "cascade" }),
  monthName: text("month_name").notNull(), // "January", "February", etc.
  monthNumber: integer("month_number").notNull(), // 1-12
  budget: decimal("budget", { precision: 12, scale: 2 }),
  createdOn: timestamp("created_on").notNull().defaultNow(),
  updatedOn: timestamp("updated_on").notNull().defaultNow(),
});

export const insertMonthSchema = createInsertSchema(months).omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type InsertMonth = z.infer<typeof insertMonthSchema>;
export type Month = typeof months.$inferSelect;

// Expenses
export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monthId: varchar("month_id")
    .notNull()
    .references(() => months.id, { onDelete: "cascade" }),
  categoryId: varchar("category_id")
    .notNull()
    .references(() => expenseCategories.id),
  subcategoryId: varchar("subcategory_id").references(
    () => expenseSubcategories.id
  ),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  expenseTime: time("expense_time"),
  paymentModeId: varchar("payment_mode_id")
    .notNull()
    .references(() => paymentModes.id),
  madeForId: varchar("made_for_id")
    .notNull()
    .references(() => madeForEntities.id),
  madeForDescription: text("made_for_description"),
  excludeFromBudget: boolean("exclude_from_budget").notNull().default(false),
  createdOn: timestamp("created_on").notNull().defaultNow(),
  updatedOn: timestamp("updated_on").notNull().defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
