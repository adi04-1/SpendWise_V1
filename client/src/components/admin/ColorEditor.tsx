import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface AppColor {
  id: string;
  colorKey: string;
  colorValue: string;
  description?: string;
}

export function ColorEditor() {
  const { toast } = useToast();
  const [editedColors, setEditedColors] = useState<Record<string, string>>({});

  const { data: colors = [], isLoading } = useQuery<AppColor[]>({
    queryKey: ["/api/admin/colors"],
  });

  const updateColorMutation = useMutation({
    mutationFn: async ({ id, colorValue }: { id: string; colorValue: string }) => {
      await apiRequest("PATCH", `/api/admin/colors/${id}`, { colorValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/colors"] });
      toast({
        title: "Colors updated",
        description: "Color settings have been saved successfully",
      });
      setEditedColors({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update colors",
        variant: "destructive",
      });
    },
  });

  const handleColorChange = (id: string, value: string) => {
    setEditedColors((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    Object.entries(editedColors).forEach(([id, colorValue]) => {
      updateColorMutation.mutate({ id, colorValue });
    });
  };

  const hasChanges = Object.keys(editedColors).length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Color Customization</CardTitle>
            <CardDescription>
              Customize colors used throughout the application
            </CardDescription>
          </div>
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={updateColorMutation.isPending}
              data-testid="button-save-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateColorMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading colors...</p>
          </div>
        ) : colors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No color settings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colors.map((color) => {
              const currentValue = editedColors[color.id] ?? color.colorValue;
              return (
                <div key={color.id} className="space-y-2">
                  <Label htmlFor={color.id}>
                    {color.colorKey}
                    {color.description && (
                      <span className="text-xs text-muted-foreground block">
                        {color.description}
                      </span>
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={color.id}
                      value={currentValue}
                      onChange={(e) => handleColorChange(color.id, e.target.value)}
                      placeholder="e.g., hsl(280 60% 60%)"
                      data-testid={`input-color-${color.colorKey}`}
                    />
                    <div
                      className="w-12 h-10 rounded border"
                      style={{ backgroundColor: currentValue }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
