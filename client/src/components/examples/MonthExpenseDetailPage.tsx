import { MonthExpenseDetailPage } from "../../pages/MonthExpenseDetailPage";
import { ThemeProvider } from "../ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export default function MonthExpenseDetailPageExample() {
  return (
    <ThemeProvider>
      <MonthExpenseDetailPage
        month="October"
        year={2025}
        userName="Adi"
        onBack={() => console.log("Back clicked")}
      />
      <Toaster />
    </ThemeProvider>
  );
}
