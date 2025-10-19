import { PresetsPage } from "../../pages/PresetsPage";
import { ThemeProvider } from "../ThemeProvider";

export default function PresetsPageExample() {
  return (
    <ThemeProvider>
      <PresetsPage
        userName="Adi"
        onBack={() => console.log("Back clicked")}
      />
    </ThemeProvider>
  );
}
