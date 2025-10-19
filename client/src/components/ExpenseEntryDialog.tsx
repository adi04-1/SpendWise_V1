import { useEffect, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Presets {
  categories: Array<{ id: string; name: string; color: string | null }>;
  subcategories: Array<{ id: string; categoryId: string; name: string }>;
  paymentModes: Array<{ id: string; name: string }>;
  madeFor: Array<{ id: string; name: string }>;
}

interface EnrichedExpense {
  id: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  subcategoryName: string | null;
  paymentModeId: string;
  paymentModeName: string;
  madeForId: string;
  madeForName: string;
  description: string;
  amount: number;
  date: string;
  time: string | null;
  excludeFromBudget: boolean;
}

interface ExpenseEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monthId: string;
  presets: Presets;
  editingExpense?: EnrichedExpense | null;
}

export function ExpenseEntryDialog({
  open,
  onOpenChange,
  monthId,
  presets,
  editingExpense,
}: ExpenseEntryDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    paymentModeId: "",
    madeForId: "",
    excludeFromBudget: false,
  });

  useEffect(() => {
    if (editingExpense && open) {
      setFormData({
        categoryId: editingExpense.categoryId,
        subcategoryId: editingExpense.subcategoryId || "",
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date,
        time: editingExpense.time || "",
        paymentModeId: editingExpense.paymentModeId,
        madeForId: editingExpense.madeForId,
        excludeFromBudget: editingExpense.excludeFromBudget,
      });
    } else if (!open) {
      setFormData({
        categoryId: "",
        subcategoryId: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        paymentModeId: "",
        madeForId: "",
        excludeFromBudget: false,
      });
    }
  }, [editingExpense, open]);

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return presets.subcategories.filter(
      (sub) => sub.categoryId === formData.categoryId
    );
  }, [formData.categoryId, presets.subcategories]);

  const createExpenseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/expenses", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/months", monthId, "expenses"] });
      toast({
        title: "Expense added",
        description: `₹${formData.amount} added successfully.`,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create expense",
        variant: "destructive",
      });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/expenses/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/months", monthId, "expenses"] });
      toast({
        title: "Expense updated",
        description: "Expense updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update expense",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.paymentModeId || !formData.madeForId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expenseData = {
      monthId,
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId || null,
      description: formData.description || null,
      amount: formData.amount,
      expenseDate: formData.date,
      expenseTime: formData.time || null,
      paymentModeId: formData.paymentModeId,
      madeForId: formData.madeForId,
      excludeFromBudget: formData.excludeFromBudget,
    };

    if (editingExpense) {
      updateExpenseMutation.mutate({ id: editingExpense.id, data: expenseData });
    } else {
      createExpenseMutation.mutate(expenseData);
    }
  };

  const isLoading = createExpenseMutation.isPending || updateExpenseMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  setFormData({ ...formData, categoryId: value, subcategoryId: "" });
                }}
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {presets.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={formData.subcategoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, subcategoryId: value })
                }
                disabled={isLoading || !formData.categoryId}
              >
                <SelectTrigger data-testid="select-subcategory">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No subcategories available
                    </SelectItem>
                  ) : (
                    filteredSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Optional"
              data-testid="input-description"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0"
              required
              className="text-2xl font-mono"
              data-testid="input-amount"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                data-testid="input-date"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                data-testid="input-time"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Payment Mode *</Label>
              <Select
                value={formData.paymentModeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentModeId: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-payment-mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {presets.paymentModes.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id}>
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="madeFor">Made For *</Label>
              <Select
                value={formData.madeForId}
                onValueChange={(value) =>
                  setFormData({ ...formData, madeForId: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger data-testid="select-made-for">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {presets.madeFor.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="excludeFromBudget"
              checked={formData.excludeFromBudget}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  excludeFromBudget: checked as boolean,
                })
              }
              data-testid="checkbox-exclude-budget"
              disabled={isLoading}
            />
            <Label htmlFor="excludeFromBudget" className="text-sm font-normal">
              Exclude from budget calculations
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              data-testid="button-save-expense"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : editingExpense ? "Update Expense" : "Save Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
