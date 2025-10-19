import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  type User,
  type InsertUser,
  users,
  type ExpenseCategory,
  type InsertExpenseCategory,
  expenseCategories,
  type ExpenseSubcategory,
  type InsertExpenseSubcategory,
  expenseSubcategories,
  type PaymentMode,
  type InsertPaymentMode,
  paymentModes,
  type MadeForEntity,
  type InsertMadeForEntity,
  madeForEntities,
  type Year,
  type InsertYear,
  years,
  type Month,
  type InsertMonth,
  months,
  type Expense,
  type InsertExpense,
  expenses,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;

  // Category operations
  getAllCategories(): Promise<ExpenseCategory[]>;
  getCategory(id: string): Promise<ExpenseCategory | undefined>;
  createCategory(category: InsertExpenseCategory): Promise<ExpenseCategory>;
  updateCategory(id: string, data: Partial<InsertExpenseCategory>): Promise<ExpenseCategory>;
  deleteCategory(id: string): Promise<void>;

  // Subcategory operations
  getAllSubcategories(): Promise<ExpenseSubcategory[]>;
  getSubcategoriesByCategory(categoryId: string): Promise<ExpenseSubcategory[]>;
  createSubcategory(
    subcategory: InsertExpenseSubcategory,
  ): Promise<ExpenseSubcategory>;
  updateSubcategory(id: string, data: Partial<InsertExpenseSubcategory>): Promise<ExpenseSubcategory>;
  deleteSubcategory(id: string): Promise<void>;

  // Payment Mode operations
  getAllPaymentModes(): Promise<PaymentMode[]>;
  createPaymentMode(mode: InsertPaymentMode): Promise<PaymentMode>;
  updatePaymentMode(id: string, data: Partial<InsertPaymentMode>): Promise<PaymentMode>;
  deletePaymentMode(id: string): Promise<void>;

  // Made For Entity operations
  getAllMadeForEntities(): Promise<MadeForEntity[]>;
  createMadeForEntity(entity: InsertMadeForEntity): Promise<MadeForEntity>;
  updateMadeForEntity(id: string, data: Partial<InsertMadeForEntity>): Promise<MadeForEntity>;
  deleteMadeForEntity(id: string): Promise<void>;

  // Year operations
  getYearsByUser(userId: string): Promise<Year[]>;
  getYear(id: string): Promise<Year | undefined>;
  createYear(year: InsertYear): Promise<Year>;
  updateYear(id: string, data: Partial<InsertYear>): Promise<Year>;
  deleteYear(id: string): Promise<void>;

  // Month operations
  getMonthsByYear(yearId: string): Promise<Month[]>;
  getMonth(id: string): Promise<Month | undefined>;
  createMonth(month: InsertMonth): Promise<Month>;
  updateMonth(id: string, data: Partial<InsertMonth>): Promise<Month>;
  deleteMonth(id: string): Promise<void>;

  // Expense operations
  getExpensesByMonth(monthId: string): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, data: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;

  // Analytics operations
  getMonthTotalSpent(monthId: string): Promise<number>;
  getYearTotalSpent(yearId: string): Promise<number>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdOn);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoggedOn: new Date() })
      .where(eq(users.id, id));
  }

  // Category operations
  async getAllCategories(): Promise<ExpenseCategory[]> {
    return await db.select().from(expenseCategories).orderBy(expenseCategories.name);
  }

  async getCategory(id: string): Promise<ExpenseCategory | undefined> {
    const result = await db
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.id, id));
    return result[0];
  }

  async createCategory(
    category: InsertExpenseCategory,
  ): Promise<ExpenseCategory> {
    const result = await db
      .insert(expenseCategories)
      .values(category)
      .returning();
    return result[0];
  }

  async updateCategory(id: string, data: Partial<InsertExpenseCategory>): Promise<ExpenseCategory> {
    const result = await db
      .update(expenseCategories)
      .set(data)
      .where(eq(expenseCategories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(expenseCategories).where(eq(expenseCategories.id, id));
  }

  // Subcategory operations
  async getAllSubcategories(): Promise<ExpenseSubcategory[]> {
    return await db.select().from(expenseSubcategories).orderBy(expenseSubcategories.name);
  }

  async getSubcategoriesByCategory(
    categoryId: string,
  ): Promise<ExpenseSubcategory[]> {
    return await db
      .select()
      .from(expenseSubcategories)
      .where(eq(expenseSubcategories.categoryId, categoryId))
      .orderBy(expenseSubcategories.name);
  }

  async createSubcategory(
    subcategory: InsertExpenseSubcategory,
  ): Promise<ExpenseSubcategory> {
    const result = await db
      .insert(expenseSubcategories)
      .values(subcategory)
      .returning();
    return result[0];
  }

  async updateSubcategory(id: string, data: Partial<InsertExpenseSubcategory>): Promise<ExpenseSubcategory> {
    const result = await db
      .update(expenseSubcategories)
      .set(data)
      .where(eq(expenseSubcategories.id, id))
      .returning();
    return result[0];
  }

  async deleteSubcategory(id: string): Promise<void> {
    await db.delete(expenseSubcategories).where(eq(expenseSubcategories.id, id));
  }

  // Payment Mode operations
  async getAllPaymentModes(): Promise<PaymentMode[]> {
    return await db.select().from(paymentModes).orderBy(paymentModes.name);
  }

  async createPaymentMode(mode: InsertPaymentMode): Promise<PaymentMode> {
    const result = await db.insert(paymentModes).values(mode).returning();
    return result[0];
  }

  async updatePaymentMode(id: string, data: Partial<InsertPaymentMode>): Promise<PaymentMode> {
    const result = await db
      .update(paymentModes)
      .set(data)
      .where(eq(paymentModes.id, id))
      .returning();
    return result[0];
  }

  async deletePaymentMode(id: string): Promise<void> {
    await db.delete(paymentModes).where(eq(paymentModes.id, id));
  }

  // Made For Entity operations
  async getAllMadeForEntities(): Promise<MadeForEntity[]> {
    return await db.select().from(madeForEntities).orderBy(madeForEntities.name);
  }

  async createMadeForEntity(
    entity: InsertMadeForEntity,
  ): Promise<MadeForEntity> {
    const result = await db.insert(madeForEntities).values(entity).returning();
    return result[0];
  }

  async updateMadeForEntity(id: string, data: Partial<InsertMadeForEntity>): Promise<MadeForEntity> {
    const result = await db
      .update(madeForEntities)
      .set(data)
      .where(eq(madeForEntities.id, id))
      .returning();
    return result[0];
  }

  async deleteMadeForEntity(id: string): Promise<void> {
    await db.delete(madeForEntities).where(eq(madeForEntities.id, id));
  }

  // Year operations
  async getYearsByUser(userId: string): Promise<Year[]> {
    return await db
      .select()
      .from(years)
      .where(eq(years.userId, userId))
      .orderBy(desc(years.year));
  }

  async getYear(id: string): Promise<Year | undefined> {
    const result = await db.select().from(years).where(eq(years.id, id));
    return result[0];
  }

  async createYear(insertYear: InsertYear): Promise<Year> {
    const result = await db.insert(years).values(insertYear).returning();
    return result[0];
  }

  async updateYear(id: string, data: Partial<InsertYear>): Promise<Year> {
    const result = await db
      .update(years)
      .set({ ...data, updatedOn: new Date() })
      .where(eq(years.id, id))
      .returning();
    return result[0];
  }

  async deleteYear(id: string): Promise<void> {
    await db.delete(years).where(eq(years.id, id));
  }

  // Month operations
  async getMonthsByYear(yearId: string): Promise<Month[]> {
    return await db
      .select()
      .from(months)
      .where(eq(months.yearId, yearId))
      .orderBy(months.monthNumber);
  }

  async getMonth(id: string): Promise<Month | undefined> {
    const result = await db.select().from(months).where(eq(months.id, id));
    return result[0];
  }

  async createMonth(insertMonth: InsertMonth): Promise<Month> {
    const result = await db.insert(months).values(insertMonth).returning();
    return result[0];
  }

  async updateMonth(id: string, data: Partial<InsertMonth>): Promise<Month> {
    const result = await db
      .update(months)
      .set({ ...data, updatedOn: new Date() })
      .where(eq(months.id, id))
      .returning();
    return result[0];
  }

  async deleteMonth(id: string): Promise<void> {
    await db.delete(months).where(eq(months.id, id));
  }

  // Expense operations
  async getExpensesByMonth(monthId: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.monthId, monthId))
      .orderBy(desc(expenses.expenseDate), desc(expenses.expenseTime));
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const result = await db.select().from(expenses).where(eq(expenses.id, id));
    return result[0];
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const result = await db.insert(expenses).values(insertExpense).returning();
    return result[0];
  }

  async updateExpense(
    id: string,
    data: Partial<InsertExpense>,
  ): Promise<Expense> {
    const result = await db
      .update(expenses)
      .set({ ...data, updatedOn: new Date() })
      .where(eq(expenses.id, id))
      .returning();
    return result[0];
  }

  async deleteExpense(id: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  // Analytics operations
  async getMonthTotalSpent(monthId: string): Promise<number> {
    const result = await db
      .select({
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.monthId, monthId),
          eq(expenses.excludeFromBudget, false),
        ),
      );

    return parseFloat(result[0]?.total || "0");
  }

  async getYearTotalSpent(yearId: string): Promise<number> {
    const result = await db
      .select({
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .innerJoin(months, eq(expenses.monthId, months.id))
      .where(
        and(eq(months.yearId, yearId), eq(expenses.excludeFromBudget, false)),
      );

    return parseFloat(result[0]?.total || "0");
  }
}

export const storage = new DbStorage();
