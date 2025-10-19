import { Card } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { ShoppingCart, Coffee } from "lucide-react";

interface MonthCardProps {
  month: string;
  year: number;
  totalSpent: number;
  budget?: number;
  topCategory?: string;
  topCategoryAmount?: number;
  onClick?: () => void;
}

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingCart,
  Food: Coffee,
};

export function MonthCard({
  month,
  year,
  totalSpent,
  budget,
  topCategory,
  topCategoryAmount,
  onClick,
}: MonthCardProps) {
  const Icon = topCategory ? categoryIcons[topCategory] : null;

  return (
    <Card
      className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-month-${month}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{month}</h3>
          <p className="text-xs text-muted-foreground">{year}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono" data-testid={`text-total-${month}`}>
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {budget && (
        <div className="mb-4">
          <ProgressBar value={totalSpent} max={budget} size="sm" />
        </div>
      )}

      {topCategory && Icon && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span>
            {topCategory}: ₹{topCategoryAmount?.toLocaleString()}
          </span>
        </div>
      )}
    </Card>
  );
}
