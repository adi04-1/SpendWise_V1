import { useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { YearCard } from "@/components/YearCard";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Settings, Plus, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AddYearDialog } from "@/components/AddYearDialog";
import { UserSettingsDialog } from "@/components/UserSettingsDialog";

interface YearOverviewPageProps {
  userName: string;
  userId: string;
  userRole: string;
  onYearSelect: (year: number, yearId: string) => void;
  onPresetsClick: () => void;
  onAdminPanelClick: () => void;
  onLogout: () => void;
}

interface YearData {
  id: string;
  year: number;
  totalSpent: number;
  budget: string | null;
  monthsActive: number;
}

export function YearOverviewPage({
  userName,
  userId,
  userRole,
  onYearSelect,
  onPresetsClick,
  onAdminPanelClick,
  onLogout,
}: YearOverviewPageProps) {
  const [showAddYear, setShowAddYear] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { data: yearsData = [], isLoading } = useQuery<YearData[]>({
    queryKey: ["/api/users", userId, "years"],
  });

  const totalSpent = yearsData.reduce((sum, y) => sum + y.totalSpent, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onLogout} data-testid="button-logout">
                <UserAvatar name={userName} size="sm" />
              </button>
              <div>
                <h2 className="text-xl font-semibold">Hi, {userName}!</h2>
                <p className="text-sm text-muted-foreground">
                  Total: ₹{(totalSpent / 100000).toFixed(2)}L
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(true)}
                data-testid="button-settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Expense Overview</h1>
          <p className="text-muted-foreground">
            Track your spending across years and manage your budget
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading years...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {yearsData.map((yearData) => (
                <YearCard
                  key={yearData.year}
                  year={yearData.year}
                  totalSpent={yearData.totalSpent}
                  budget={yearData.budget ? parseFloat(yearData.budget) : undefined}
                  monthsActive={yearData.monthsActive}
                  onClick={() => onYearSelect(yearData.year, yearData.id)}
                />
              ))}

              <Card
                className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-dashed"
                onClick={onPresetsClick}
                data-testid="card-presets"
              >
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Presets</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage categories & settings
                    </p>
                  </div>
                </div>
              </Card>

              {(userRole === "admin" || userRole === "superadmin") && (
                <Card
                  className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all border-dashed border-primary/50"
                  onClick={onAdminPanelClick}
                  data-testid="card-admin-panel"
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Admin Panel</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage data, users & colors
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => setShowAddYear(true)}
                variant="outline"
                data-testid="button-add-year"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Year
              </Button>
              <Button variant="outline" data-testid="button-view-reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </>
        )}
      </main>

      <AddYearDialog
        open={showAddYear}
        onOpenChange={setShowAddYear}
        userId={userId}
      />
      
      <UserSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        userId={userId}
        onAccountDeleted={onLogout}
      />
    </div>
  );
}
