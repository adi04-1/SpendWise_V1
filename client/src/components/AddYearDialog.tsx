import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const addYearSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Year must be 2100 or earlier"),
  budget: z.string().optional(),
});

type AddYearFormData = z.infer<typeof addYearSchema>;

interface AddYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function AddYearDialog({
  open,
  onOpenChange,
  userId,
}: AddYearDialogProps) {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const form = useForm<AddYearFormData>({
    resolver: zodResolver(addYearSchema),
    defaultValues: {
      year: currentYear,
      budget: "",
    },
  });

  const createYearMutation = useMutation({
    mutationFn: async (data: AddYearFormData) => {
      const response = await apiRequest("POST", "/api/years", {
        userId,
        year: data.year,
        budget: data.budget || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "years"] });
      toast({
        title: "Year added successfully",
        description: `Year ${form.getValues().year} has been created.`,
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add year",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddYearFormData) => {
    createYearMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-year">
        <DialogHeader>
          <DialogTitle>Add New Year</DialogTitle>
          <DialogDescription>
            Create a new year to track your expenses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={currentYear.toString()}
                      data-testid="input-year"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Budget (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 600000"
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
                disabled={createYearMutation.isPending}
                data-testid="button-submit"
              >
                {createYearMutation.isPending ? "Adding..." : "Add Year"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
