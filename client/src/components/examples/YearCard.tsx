import { YearCard } from "../YearCard";

export default function YearCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <YearCard
        year={2025}
        totalSpent={243560}
        budget={600000}
        monthsActive={9}
        onClick={() => console.log("Year 2025 clicked")}
      />
    </div>
  );
}
