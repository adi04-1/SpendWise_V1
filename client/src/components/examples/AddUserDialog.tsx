import { AddUserDialog } from "../AddUserDialog";
import { Toaster } from "@/components/ui/toaster";

export default function AddUserDialogExample() {
  return (
    <div className="p-8">
      <AddUserDialog />
      <Toaster />
    </div>
  );
}
