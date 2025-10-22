import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onAccountDeleted: () => void;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  firstName: string;
  role: string;
  mobileNumber?: string;
  shortName?: string;
}

export function UserSettingsDialog({ open, onOpenChange, userId, onAccountDeleted }: UserSettingsDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", userId],
    enabled: open,
  });

  const [formData, setFormData] = useState({
    username: "",
    mobileNumber: "",
    fullName: "",
    firstName: "",
    shortName: "",
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user && open) {
      setFormData({
        username: user.username,
        mobileNumber: user.mobileNumber || "",
        fullName: user.fullName,
        firstName: user.firstName,
        shortName: user.shortName || "",
      });
    }
  }, [user, open]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("PATCH", `/api/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
      onAccountDeleted();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  const handleDelete = () => {
    deleteUserMutation.mutate();
    setShowDeleteConfirm(false);
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-username">Username</Label>
              <Input
                id="settings-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                data-testid="input-settings-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-mobile">Mobile Number</Label>
              <Input
                id="settings-mobile"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                data-testid="input-settings-mobile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-fullname">Full Name</Label>
              <Input
                id="settings-fullname"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                data-testid="input-settings-fullname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-firstname">First Name</Label>
              <Input
                id="settings-firstname"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                data-testid="input-settings-firstname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-shortname">Short Name</Label>
              <Input
                id="settings-shortname"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                maxLength={2}
                data-testid="input-settings-shortname"
              />
            </div>
            
            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button type="submit" className="w-full" data-testid="button-save-profile">
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                className="w-full"
                onClick={() => setShowDeleteConfirm(true)}
                data-testid="button-delete-account"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data including years, months, and expenses from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
