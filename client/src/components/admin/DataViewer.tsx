import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
