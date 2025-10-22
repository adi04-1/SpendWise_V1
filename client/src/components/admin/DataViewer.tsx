import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const TABLES = [
  { value: "users", label: "Users" },
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
  { value: "expenses", label: "Expenses" },
  { value: "expense_categories", label: "Expense Categories" },
  { value: "expense_subcategories", label: "Expense Subcategories" },
  { value: "payment_modes", label: "Payment Modes" },
  { value: "made_for_entities", label: "Made For Entities" },
  { value: "expense_splits", label: "Expense Splits" },
  { value: "app_colors", label: "App Colors" },
];

const ITEMS_PER_PAGE = 20;

export function DataViewer() {
  const [selectedTable, setSelectedTable] = useState<string>("users");
  const [page, setPage] = useState(1);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/table", selectedTable, page],
    enabled: !!selectedTable,
  });

  const tableData = data || [];
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
    setPage(1);
  };

  const handleEditClick = (row: any) => {
    setEditingRow(row);
    setEditFormData({ ...row });
  };

  const updateRowMutation = useMutation({
    mutationFn: async (data: { table: string; id: string; updates: Record<string, any> }) => {
      return apiRequest("PATCH", `/api/admin/table/${data.table}/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/table", selectedTable, page] });
      toast({
        title: "Data updated",
        description: "The record has been updated successfully.",
      });
      setEditingRow(null);
      setEditFormData({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveEdit = () => {
    if (editingRow && editingRow.id) {
      updateRowMutation.mutate({
        table: selectedTable,
        id: editingRow.id,
        updates: editFormData,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Tables</CardTitle>
        <CardDescription>
          View and manage all database tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Select value={selectedTable} onValueChange={handleTableChange}>
            <SelectTrigger className="w-64" data-testid="select-table">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {TABLES.map((table) => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={tableData.length < ITEMS_PER_PAGE}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No data found</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column} className="max-w-xs truncate">
                        {String(row[column] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(row)}
                        disabled={!row.id}
                        data-testid={`button-edit-row-${index}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editingRow} onOpenChange={(open) => !open && setEditingRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingRow && Object.keys(editingRow).map((key) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`edit-${key}`} className="text-right">
                  {key}
                </Label>
                <Input
                  id={`edit-${key}`}
                  value={editFormData[key] ?? ""}
                  onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                  className="col-span-3"
                  disabled={key === "id" || key === "createdOn"}
                  data-testid={`input-edit-${key}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRow(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateRowMutation.isPending}>
              {updateRowMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
