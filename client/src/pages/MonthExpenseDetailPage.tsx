import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { UserAvatar } from "@/components/UserAvatar";
import { ExpenseListItem } from "@/components/ExpenseListItem";
import { ExpenseEntryDialog } from "@/components/ExpenseEntryDialog";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, PieChart, TrendingUp } from "lucide-react";
import type { Month } from "@shared/schema";

interface EnrichedExpense {
  id: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  paymentModeId: string;
  paymentModeName: string;
  madeForId: string;
  madeForName: string;
  description: string;
  amount: number;
  date: string;
  time: string | null;
  excludeFromBudget: boolean;
}

interface Presets {
  categories: Array<{ id: string; name: string; color: string | null }>;
  subcategories: Array<{ id: string; categoryId: string; name: string }>;
  paymentModes: Array<{ id: string; name: string }>;
  madeFor: Array<{ id: string; name: string }>;
}

interface MonthExpenseDetailPageProps {
  monthId: string;
  month: string;
  year: number;
  userName: string;
  onBack: () => void;
}

export function MonthExpenseDetailPage({
  monthId,
  month,
  year,
  userName,
  onBack,
}: MonthExpenseDetailPageProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<EnrichedExpense | null>(null);

  const { data: monthData, isLoading: isLoadingMonth } = useQuery<Month>({
    queryKey: ["/api/months", monthId],
  });

  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery<EnrichedExpense[]>({
    queryKey: ["/api/months", monthId, "expenses"],
  });

  const { data: presets, isLoading: isLoadingPresets } = useQuery<Presets>({
    queryKey: ["/api/presets"],
  });

  const isLoading = isLoadingMonth || isLoadingExpenses || isLoadingPresets;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = monthData?.budget ? parseFloat(monthData.budget) : 0;

  const categoryTotals: Record<string, { name: string; total: number }> = {};
  expenses.forEach((expense) => {
    if (!categoryTotals[expense.categoryId]) {
      categoryTotals[expense.categoryId] = {
        name: expense.categoryName,
        total: 0,
      };
    }
    categoryTotals[expense.categoryId].total += expense.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b.total - a.total
  )[0];

  const handleEditExpense = (expense: EnrichedExpense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleCloseDialog = () => {
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <UserAvatar name={userName} size="sm" />
              <div>
                <h2 className="text-xl font-semibold">
                  {month} {year}
                </h2>
                {isLoading ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    ₹{totalSpent.toLocaleString()} spent
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => setShowAddExpense(true)}
                size="sm"
                data-testid="button-add-expense"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Spent
              </h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <p className="text-3xl font-bold font-mono" data-testid="text-total-spent">
                ₹{totalSpent.toLocaleString()}
              </p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Budget Usage
              </h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <p className="text-3xl font-bold font-mono">
                  {budget > 0 ? ((totalSpent / budget) * 100).toFixed(0) : 0}%
                </p>
                <div className="mt-3">
                  <ProgressBar value={totalSpent} max={budget} size="sm" />
                </div>
              </>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              {topCategory && (
                <div className="h-3 w-3 rounded-full bg-category-shopping" />
              )}
              <h3 className="text-sm font-medium text-muted-foreground">
                Top Category
              </h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : topCategory ? (
              <>
                <p className="text-xl font-semibold">{topCategory[1].name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{topCategory[1].total.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No expenses yet</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Transactions
              </h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-10 w-16" />
            ) : (
              <p className="text-3xl font-bold font-mono">{expenses.length}</p>
            )}
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Expense List</h2>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : expenses.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">
                No expenses recorded for this month yet
              </p>
            </Card>
          ) : (
            expenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                category={expense.categoryName}
                subcategory={expense.subcategoryName || ""}
                description={expense.description}
                amount={expense.amount}
                date={format(new Date(expense.date), "MMM dd, yyyy")}
                paymentMode={expense.paymentModeName}
                madeFor={expense.madeForName}
                onClick={() => handleEditExpense(expense)}
              />
            ))
          )}
        </div>
      </main>

      {presets && (
        <ExpenseEntryDialog
          open={showAddExpense}
          onOpenChange={handleCloseDialog}
          monthId={monthId}
          presets={presets}
          editingExpense={editingExpense}
        />
      )}
    </div>
  );
}
