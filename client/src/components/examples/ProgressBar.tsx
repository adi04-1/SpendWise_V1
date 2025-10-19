import { ProgressBar } from "../ProgressBar";
import { Card } from "@/components/ui/card";

export default function ProgressBarExample() {
  return (
    <Card className="p-8 max-w-md space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Under budget (40%)</p>
        <ProgressBar value={40000} max={100000} showLabel />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Near budget (85%)</p>
        <ProgressBar value={85000} max={100000} showLabel />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Over budget (105%)</p>
        <ProgressBar value={105000} max={100000} showLabel />
      </div>
    </Card>
  );
}
