import { useState } from "react";
import { ExpenseEntryDialog } from "../ExpenseEntryDialog";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

export default function ExpenseEntryDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Expense Entry Form</Button>
      <ExpenseEntryDialog open={open} onOpenChange={setOpen} />
      <Toaster />
    </div>
  );
}
