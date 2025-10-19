import { ThemeProvider } from "../ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";
import { Card } from "@/components/ui/card";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <Card className="p-8">
        <p className="mb-4 text-sm text-muted-foreground">
          Click to toggle between light and dark mode
        </p>
        <ThemeToggle />
      </Card>
    </ThemeProvider>
  );
}
