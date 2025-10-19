import { UserLoginPage } from "../../pages/UserLoginPage";
import { ThemeProvider } from "../ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export default function UserLoginPageExample() {
  return (
    <ThemeProvider>
      <UserLoginPage
        onUserSelect={(id, name) => console.log("Selected:", id, name)}
      />
      <Toaster />
    </ThemeProvider>
  );
}
