import { useState } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { AddUserDialog } from "@/components/AddUserDialog";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface UserLoginPageProps {
  onUserSelect: (userId: string, userName: string) => void;
}

export function UserLoginPage({ onUserSelect }: UserLoginPageProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const loginMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("POST", `/api/users/${userId}/login`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const handleSelectUser = async (userId: string, userName: string) => {
    setSelectedUser(userId);
    await loginMutation.mutateAsync(userId);
    setTimeout(() => {
      onUserSelect(userId, userName);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Expense Tracker</h1>
            <p className="text-muted-foreground">Select a user to continue</p>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <AddUserDialog />

            {users
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col items-center gap-3"
                  data-testid={`user-card-${user.firstName.toLowerCase()}`}
                >
                  <UserAvatar
                    name={user.firstName}
                    shortName={user.shortName || undefined}
                    size="lg"
                    isActive={selectedUser === user.id}
                  />
                  <div className="text-center">
                    <p className="font-medium mb-2">{user.firstName}</p>
                    <Button
                      onClick={() => handleSelectUser(user.id, user.firstName)}
                      size="sm"
                      data-testid={`button-select-${user.firstName.toLowerCase()}`}
                    >
                      Select User
                    </Button>
                  </div>
                </div>
              ))}

            {users
              .filter((user) => user.role === "admin")
              .map((admin) => (
                <div
                  key={admin.id}
                  className="flex flex-col items-center gap-3"
                  data-testid="user-card-admin"
                >
                  <div className="h-20 w-20 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
                    <Shield className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium mb-2">Admin</p>
                    <Button
                      onClick={() =>
                        handleSelectUser(admin.id, admin.firstName)
                      }
                      size="sm"
                      variant="destructive"
                      data-testid="button-select-admin"
                    >
                      Admin Panel
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
