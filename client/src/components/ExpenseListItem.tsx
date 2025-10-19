import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExpenseListItemProps {
  category: string;
  subcategory: string;
  description?: string;
  amount: number;
  date: string;
  paymentMode: string;
  madeFor: string;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  Shopping: "bg-category-shopping",
  Food: "bg-category-food",
  Bills: "bg-category-bills",
  Others: "bg-category-others",
  Misc: "bg-category-misc",
};

export function ExpenseListItem({
  category,
  subcategory,
  description,
  amount,
  date,
  paymentMode,
  madeFor,
  onClick,
}: ExpenseListItemProps) {
  const accentColor = categoryColors[category] || "bg-primary";

  return (
    <Card
      className={`p-4 hover-elevate active-elevate-2 cursor-pointer transition-all border-l-4 ${accentColor} border-l-opacity-100`}
      onClick={onClick}
      data-testid={`expense-item-${subcategory}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {category}
            </span>
            <span className="text-sm text-muted-foreground">→</span>
            <span className="text-sm text-muted-foreground">{subcategory}</span>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {paymentMode}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {madeFor}
            </Badge>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono" data-testid={`text-amount-${subcategory}`}>
            ₹{amount.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
