import { useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { MonthCard } from "@/components/MonthCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MonthlyOverviewPageProps {
  year: number;
  yearId: string;
  userName: string;
  onBack: () => void;
  onMonthSelect: (month: string, monthId: string, year: number) => void;
}

interface MonthData {
  id: string;
  monthName: string;
  monthNumber: number;
  totalSpent: number;
  budget: string | null;
  topCategory: string | null;
  topCategoryAmount: number;
}

export function MonthlyOverviewPage({
  year,
  yearId,
  userName,
  onBack,
  onMonthSelect,
}: MonthlyOverviewPageProps) {
  const [showAddMonth, setShowAddMonth] = useState(false);

  const { data: monthsData = [], isLoading } = useQuery<MonthData[]>({
    queryKey: ["/api/years", yearId, "months"],
  });

  const yearTotal = monthsData.reduce((sum, m) => sum + m.totalSpent, 0);

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
                <h2 className="text-xl font-semibold">{year} Expenses</h2>
                <p className="text-sm text-muted-foreground">
                  Total: ₹{yearTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{year} Monthly Tracker</h1>
            <p className="text-muted-foreground">
              View and manage your monthly expenses
            </p>
          </div>
          <Button
            onClick={() => setShowAddMonth(!showAddMonth)}
            data-testid="button-add-month"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Month
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading months...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthsData.map((monthData) => (
              <MonthCard
                key={monthData.id}
                month={monthData.monthName}
                year={year}
                totalSpent={monthData.totalSpent}
                budget={monthData.budget ? parseFloat(monthData.budget) : undefined}
                topCategory={monthData.topCategory || undefined}
                topCategoryAmount={monthData.topCategoryAmount}
                onClick={() =>
                  onMonthSelect(monthData.monthName, monthData.id, year)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
