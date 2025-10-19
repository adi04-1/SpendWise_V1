import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const MONTHS = [
  { name: "January", number: 1 },
  { name: "February", number: 2 },
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 },
];

const addMonthSchema = z.object({
  monthName: z.string().min(1, "Please select a month"),
  monthNumber: z.coerce.number().int().min(1).max(12),
  budget: z.string().optional(),
});

type AddMonthFormData = z.infer<typeof addMonthSchema>;

interface AddMonthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yearId: string;
  year: number;
}

export function AddMonthDialog({
  open,
  onOpenChange,
  yearId,
  year,
}: AddMonthDialogProps) {
  const { toast } = useToast();

  const form = useForm<AddMonthFormData>({
    resolver: zodResolver(addMonthSchema),
    defaultValues: {
      monthName: "",
      monthNumber: 1,
      budget: "",
    },
  });

  const createMonthMutation = useMutation({
    mutationFn: async (data: AddMonthFormData) => {
      const response = await apiRequest("POST", "/api/months", {
        yearId,
        monthName: data.monthName,
        monthNumber: data.monthNumber,
        budget: data.budget || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/years", yearId, "months"] });
      toast({
        title: "Month added successfully",
        description: `${form.getValues().monthName} has been created.`,
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add month",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddMonthFormData) => {
    createMonthMutation.mutate(data);
  };

  const handleMonthSelect = (monthName: string) => {
    const month = MONTHS.find((m) => m.name === monthName);
    if (month) {
      form.setValue("monthName", month.name);
      form.setValue("monthNumber", month.number);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-month">
        <DialogHeader>
          <DialogTitle>Add New Month</DialogTitle>
          <DialogDescription>
            Create a new month for {year} to track expenses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="monthName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select
                    onValueChange={handleMonthSelect}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-month">
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MONTHS.map((month) => (
                        <SelectItem
                          key={month.number}
                          value={month.name}
                          data-testid={`month-${month.name.toLowerCase()}`}
                        >
                          {month.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      data-testid="input-budget"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMonthMutation.isPending}
                data-testid="button-submit"
              >
                {createMonthMutation.isPending ? "Adding..." : "Add Month"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
