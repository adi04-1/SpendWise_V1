import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertExpenseCategorySchema,
  insertExpenseSubcategorySchema,
  insertPaymentModeSchema,
  insertMadeForEntitySchema,
  insertYearSchema,
  insertMonthSchema,
  insertExpenseSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============= USER ROUTES =============
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/users/:id/login", async (req, res) => {
    try {
      await storage.updateUserLastLogin(req.params.id);
      const user = await storage.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update login time" });
    }
  });

  // ============= CATEGORY ROUTES =============
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertExpenseCategorySchema.parse(req.body);
      const category = await storage.createCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // ============= SUBCATEGORY ROUTES =============
  app.get("/api/subcategories", async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const subcategories = categoryId
        ? await storage.getSubcategoriesByCategory(categoryId)
        : await storage.getAllSubcategories();
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  app.post("/api/subcategories", async (req, res) => {
    try {
      const validated = insertExpenseSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(validated);
      res.status(201).json(subcategory);
    } catch (error) {
      res.status(400).json({ error: "Invalid subcategory data" });
    }
  });

  app.patch("/api/subcategories/:id", async (req, res) => {
    try {
      const subcategory = await storage.updateSubcategory(req.params.id, req.body);
      res.json(subcategory);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subcategory" });
    }
  });

  app.delete("/api/subcategories/:id", async (req, res) => {
    try {
      await storage.deleteSubcategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subcategory" });
    }
  });

  // ============= PAYMENT MODE ROUTES =============
  app.get("/api/payment-modes", async (req, res) => {
    try {
      const modes = await storage.getAllPaymentModes();
      res.json(modes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment modes" });
    }
  });

  app.post("/api/payment-modes", async (req, res) => {
    try {
      const validated = insertPaymentModeSchema.parse(req.body);
      const mode = await storage.createPaymentMode(validated);
      res.status(201).json(mode);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment mode data" });
    }
  });

  app.patch("/api/payment-modes/:id", async (req, res) => {
    try {
      const mode = await storage.updatePaymentMode(req.params.id, req.body);
      res.json(mode);
    } catch (error) {
      res.status(400).json({ error: "Failed to update payment mode" });
    }
  });

  app.delete("/api/payment-modes/:id", async (req, res) => {
    try {
      await storage.deletePaymentMode(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment mode" });
    }
  });

  // ============= MADE FOR ENTITY ROUTES =============
  app.get("/api/made-for-entities", async (req, res) => {
    try {
      const entities = await storage.getAllMadeForEntities();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch made-for entities" });
    }
  });

  app.post("/api/made-for-entities", async (req, res) => {
    try {
      const validated = insertMadeForEntitySchema.parse(req.body);
      const entity = await storage.createMadeForEntity(validated);
      res.status(201).json(entity);
    } catch (error) {
      res.status(400).json({ error: "Invalid made-for entity data" });
    }
  });

  app.patch("/api/made-for-entities/:id", async (req, res) => {
    try {
      const entity = await storage.updateMadeForEntity(req.params.id, req.body);
      res.json(entity);
    } catch (error) {
      res.status(400).json({ error: "Failed to update made-for entity" });
    }
  });

  app.delete("/api/made-for-entities/:id", async (req, res) => {
    try {
      await storage.deleteMadeForEntity(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete made-for entity" });
    }
  });

  // ============= YEAR ROUTES =============
  app.get("/api/users/:userId/years", async (req, res) => {
    try {
      const yearsData = await storage.getYearsByUser(req.params.userId);

      // Enrich with total spent for each year
      const enrichedYears = await Promise.all(
        yearsData.map(async (year) => {
          const totalSpent = await storage.getYearTotalSpent(year.id);
          const monthsData = await storage.getMonthsByYear(year.id);
          return {
            ...year,
            totalSpent,
            monthsActive: monthsData.length,
          };
        })
      );

      res.json(enrichedYears);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch years" });
    }
  });

  app.get("/api/years/:id", async (req, res) => {
    try {
      const year = await storage.getYear(req.params.id);
      if (!year) {
        return res.status(404).json({ error: "Year not found" });
      }
      res.json(year);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch year" });
    }
  });

  app.post("/api/years", async (req, res) => {
    try {
      const validated = insertYearSchema.parse(req.body);
      const year = await storage.createYear(validated);
      res.status(201).json(year);
    } catch (error) {
      res.status(400).json({ error: "Invalid year data" });
    }
  });

  app.patch("/api/years/:id", async (req, res) => {
    try {
      const year = await storage.updateYear(req.params.id, req.body);
      res.json(year);
    } catch (error) {
      res.status(400).json({ error: "Failed to update year" });
    }
  });

  app.delete("/api/years/:id", async (req, res) => {
    try {
      await storage.deleteYear(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete year" });
    }
  });

  // ============= MONTH ROUTES =============
  app.get("/api/years/:yearId/months", async (req, res) => {
    try {
      const monthsData = await storage.getMonthsByYear(req.params.yearId);

      // Enrich with total spent for each month
      const enrichedMonths = await Promise.all(
        monthsData.map(async (month) => {
          const totalSpent = await storage.getMonthTotalSpent(month.id);
          const expensesData = await storage.getExpensesByMonth(month.id);

          // Calculate top category
          const categoryTotals: Record<string, number> = {};
          for (const expense of expensesData) {
            const categoryId = expense.categoryId;
            categoryTotals[categoryId] =
              (categoryTotals[categoryId] || 0) + parseFloat(expense.amount);
          }

          const topCategoryId = Object.entries(categoryTotals).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0];

          let topCategoryName = null;
          let topCategoryAmount = null;
          if (topCategoryId) {
            const category = await storage.getCategory(topCategoryId);
            topCategoryName = category?.name || null;
            topCategoryAmount = categoryTotals[topCategoryId];
          }

          return {
            ...month,
            totalSpent,
            topCategory: topCategoryName,
            topCategoryAmount,
          };
        })
      );

      res.json(enrichedMonths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch months" });
    }
  });

  app.get("/api/months/:id", async (req, res) => {
    try {
      const month = await storage.getMonth(req.params.id);
      if (!month) {
        return res.status(404).json({ error: "Month not found" });
      }
      res.json(month);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch month" });
    }
  });

  app.post("/api/months", async (req, res) => {
    try {
      const validated = insertMonthSchema.parse(req.body);
      const month = await storage.createMonth(validated);
      res.status(201).json(month);
    } catch (error) {
      res.status(400).json({ error: "Invalid month data" });
    }
  });

  app.patch("/api/months/:id", async (req, res) => {
    try {
      const month = await storage.updateMonth(req.params.id, req.body);
      res.json(month);
    } catch (error) {
      res.status(400).json({ error: "Failed to update month" });
    }
  });

  app.delete("/api/months/:id", async (req, res) => {
    try {
      await storage.deleteMonth(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete month" });
    }
  });

  // ============= PRESETS ROUTE =============
  app.get("/api/presets", async (req, res) => {
    try {
      const [categories, subcategories, paymentModes, madeFor] = await Promise.all([
        storage.getAllCategories(),
        storage.getAllSubcategories(),
        storage.getAllPaymentModes(),
        storage.getAllMadeForEntities(),
      ]);

      res.json({
        categories,
        subcategories,
        paymentModes,
        madeFor,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presets" });
    }
  });

  // ============= EXPENSE ROUTES =============
  app.get("/api/months/:monthId/expenses", async (req, res) => {
    try {
      const expensesData = await storage.getExpensesByMonth(req.params.monthId);

      const enrichedExpenses = await Promise.all(
        expensesData.map(async (expense) => {
          const [category, subcategory, paymentMode, madeFor] = await Promise.all([
            storage.getCategory(expense.categoryId),
            expense.subcategoryId ? storage.getSubcategoriesByCategory(expense.categoryId).then(subs => subs.find(s => s.id === expense.subcategoryId)) : Promise.resolve(null),
            storage.getAllPaymentModes().then(modes => modes.find(m => m.id === expense.paymentModeId)),
            storage.getAllMadeForEntities().then(entities => entities.find(e => e.id === expense.madeForId)),
          ]);

          return {
            id: expense.id,
            categoryId: expense.categoryId,
            categoryName: category?.name || "",
            subcategoryId: expense.subcategoryId,
            subcategoryName: subcategory?.name || null,
            paymentModeId: expense.paymentModeId,
            paymentModeName: paymentMode?.name || "",
            madeForId: expense.madeForId,
            madeForName: madeFor?.name || "",
            description: expense.description || "",
            amount: parseFloat(expense.amount),
            date: expense.expenseDate,
            time: expense.expenseTime,
            excludeFromBudget: expense.excludeFromBudget,
          };
        })
      );

      res.json(enrichedExpenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getExpense(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validated = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validated);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.updateExpense(req.params.id, req.body);
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // ============= ANALYTICS ROUTES =============
  app.get("/api/months/:monthId/analytics", async (req, res) => {
    try {
      const totalSpent = await storage.getMonthTotalSpent(req.params.monthId);
      res.json({ totalSpent });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/years/:yearId/analytics", async (req, res) => {
    try {
      const totalSpent = await storage.getYearTotalSpent(req.params.yearId);
      res.json({ totalSpent });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
