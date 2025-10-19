import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserLoginPage } from "@/pages/UserLoginPage";
import { YearOverviewPage } from "@/pages/YearOverviewPage";
import { MonthlyOverviewPage } from "@/pages/MonthlyOverviewPage";
import { MonthExpenseDetailPage } from "@/pages/MonthExpenseDetailPage";
import { PresetsPage } from "@/pages/PresetsPage";

type Screen =
  | { type: "login" }
  | { type: "yearOverview"; userId: string; userName: string }
  | {
      type: "monthlyOverview";
      userId: string;
      userName: string;
      year: number;
      yearId: string;
    }
  | {
      type: "monthDetail";
      userId: string;
      userName: string;
      year: number;
      yearId: string;
      month: string;
      monthId: string;
    }
  | { type: "presets"; userId: string; userName: string };

function App() {
  const [screen, setScreen] = useState<Screen>({ type: "login" });

  const handleUserSelect = (userId: string, userName: string) => {
    setScreen({ type: "yearOverview", userId, userName });
  };

  const handleYearSelect = (year: number, yearId: string) => {
    if (screen.type === "yearOverview") {
      setScreen({
        type: "monthlyOverview",
        userId: screen.userId,
        userName: screen.userName,
        year,
        yearId,
      });
    }
  };

  const handleMonthSelect = (
    month: string,
    monthId: string,
    year: number
  ) => {
    if (screen.type === "monthlyOverview") {
      setScreen({
        type: "monthDetail",
        userId: screen.userId,
        userName: screen.userName,
        year,
        yearId: screen.yearId,
        month,
        monthId,
      });
    }
  };

  const handlePresetsClick = () => {
    if (screen.type === "yearOverview") {
      setScreen({
        type: "presets",
        userId: screen.userId,
        userName: screen.userName,
      });
    }
  };

  const handleBackToYears = () => {
    if (screen.type === "monthlyOverview" || screen.type === "presets") {
      setScreen({
        type: "yearOverview",
        userId: screen.userId,
        userName: screen.userName,
      });
    }
  };

  const handleBackToMonths = () => {
    if (screen.type === "monthDetail") {
      setScreen({
        type: "monthlyOverview",
        userId: screen.userId,
        userName: screen.userName,
        year: screen.year,
        yearId: screen.yearId,
      });
    }
  };

  const handleLogout = () => {
    setScreen({ type: "login" });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {screen.type === "login" && (
            <UserLoginPage onUserSelect={handleUserSelect} />
          )}
          {screen.type === "yearOverview" && (
            <YearOverviewPage
              userName={screen.userName}
              userId={screen.userId}
              onYearSelect={handleYearSelect}
              onPresetsClick={handlePresetsClick}
              onLogout={handleLogout}
            />
          )}
          {screen.type === "monthlyOverview" && (
            <MonthlyOverviewPage
              year={screen.year}
              yearId={screen.yearId}
              userName={screen.userName}
              onBack={handleBackToYears}
              onMonthSelect={handleMonthSelect}
            />
          )}
          {screen.type === "monthDetail" && (
            <MonthExpenseDetailPage
              month={screen.month}
              monthId={screen.monthId}
              year={screen.year}
              userName={screen.userName}
              onBack={handleBackToMonths}
            />
          )}
          {screen.type === "presets" && (
            <PresetsPage userName={screen.userName} onBack={handleBackToYears} />
          )}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
