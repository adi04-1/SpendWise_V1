import { MonthCard } from "../MonthCard";

export default function MonthCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <MonthCard
        month="October"
        year={2025}
        totalSpent={28450}
        budget={50000}
        topCategory="Shopping"
        topCategoryAmount={12300}
        onClick={() => console.log("October clicked")}
      />
    </div>
  );
}
