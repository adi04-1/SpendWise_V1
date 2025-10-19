import { MonthlyOverviewPage } from "../../pages/MonthlyOverviewPage";
import { ThemeProvider } from "../ThemeProvider";

export default function MonthlyOverviewPageExample() {
  return (
    <ThemeProvider>
      <MonthlyOverviewPage
        year={2025}
        userName="Adi"
        onBack={() => console.log("Back clicked")}
        onMonthSelect={(month, year) => console.log("Month selected:", month, year)}
      />
    </ThemeProvider>
  );
}
