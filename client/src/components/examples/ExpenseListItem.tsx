import { ExpenseListItem } from "../ExpenseListItem";

export default function ExpenseListItemExample() {
  return (
    <div className="p-8 max-w-2xl space-y-4">
      <ExpenseListItem
        category="Shopping"
        subcategory="Amazon"
        description="Ladder"
        amount={1639}
        date="Oct 18, 2025"
        paymentMode="Credit Card"
        madeFor="Personal"
        onClick={() => console.log("Expense clicked")}
      />
      <ExpenseListItem
        category="Food"
        subcategory="Swiggy"
        description="Dinner order"
        amount={450}
        date="Oct 16, 2025"
        paymentMode="GPay"
        madeFor="Shared"
        onClick={() => console.log("Expense clicked")}
      />
    </div>
  );
}
