import { YearOverviewPage } from "../../pages/YearOverviewPage";
import { ThemeProvider } from "../ThemeProvider";

export default function YearOverviewPageExample() {
  return (
    <ThemeProvider>
      <YearOverviewPage
        userName="Adi"
        onYearSelect={(year) => console.log("Year selected:", year)}
        onPresetsClick={() => console.log("Presets clicked")}
        onLogout={() => console.log("Logout clicked")}
      />
    </ThemeProvider>
  );
}
