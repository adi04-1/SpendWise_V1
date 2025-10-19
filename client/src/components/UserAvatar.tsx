import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  shortName?: string;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
}

const sizeClasses = {
  sm: "h-12 w-12 text-sm",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-lg",
};

const colorMap: Record<string, string> = {
  A: "bg-chart-1 text-primary-foreground",
  B: "bg-chart-2 text-primary-foreground",
  C: "bg-chart-3 text-primary-foreground",
  D: "bg-chart-4 text-primary-foreground",
  E: "bg-chart-5 text-primary-foreground",
  F: "bg-category-shopping text-primary-foreground",
  G: "bg-category-food text-primary-foreground",
  H: "bg-category-bills text-primary-foreground",
  I: "bg-chart-1 text-primary-foreground",
  J: "bg-chart-2 text-primary-foreground",
  K: "bg-chart-3 text-primary-foreground",
  L: "bg-chart-4 text-primary-foreground",
  M: "bg-chart-5 text-primary-foreground",
  N: "bg-category-shopping text-primary-foreground",
  O: "bg-category-food text-primary-foreground",
  P: "bg-category-bills text-primary-foreground",
  Q: "bg-chart-1 text-primary-foreground",
  R: "bg-chart-2 text-primary-foreground",
  S: "bg-chart-3 text-primary-foreground",
  T: "bg-chart-4 text-primary-foreground",
  U: "bg-chart-5 text-primary-foreground",
  V: "bg-category-shopping text-primary-foreground",
  W: "bg-category-food text-primary-foreground",
  X: "bg-category-bills text-primary-foreground",
  Y: "bg-chart-1 text-primary-foreground",
  Z: "bg-chart-2 text-primary-foreground",
};

export function UserAvatar({ name, shortName, size = "md", isActive = false }: UserAvatarProps) {
  const initials = shortName || name.slice(0, 2).toUpperCase();
  const firstLetter = initials[0].toUpperCase();
  const colorClass = colorMap[firstLetter] || "bg-primary text-primary-foreground";

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar
        className={`${sizeClasses[size]} ${isActive ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""} transition-all`}
      >
        <AvatarFallback className={`${colorClass} font-semibold`}>
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
