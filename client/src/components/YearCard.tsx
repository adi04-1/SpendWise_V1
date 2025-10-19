import { Card } from "@/components/ui/card";
import { ProgressBar } from "./ProgressBar";
import { Calendar } from "lucide-react";

interface YearCardProps {
  year: number;
  totalSpent: number;
  budget?: number;
  monthsActive: number;
  onClick?: () => void;
}

export function YearCard({ year, totalSpent, budget, monthsActive, onClick }: YearCardProps) {
  return (
    <Card
      className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-year-${year}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold">{year}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {monthsActive} / 12 months
          </p>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
          <p className="text-2xl font-bold font-mono" data-testid={`text-total-${year}`}>
            ₹{(totalSpent / 100000).toFixed(2)}L
          </p>
        </div>

        {budget && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Budget Progress</p>
            <ProgressBar value={totalSpent} max={budget} size="sm" />
          </div>
        )}
      </div>
    </Card>
  );
}
