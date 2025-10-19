import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserAvatar } from "@/components/UserAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

interface PaymentMode {
  id: string;
  name: string;
}

interface MadeForEntity {
  id: string;
  name: string;
}

interface Presets {
  categories: Category[];
  subcategories: Subcategory[];
  paymentModes: PaymentMode[];
  madeFor: MadeForEntity[];
}

interface PresetsPageProps {
  userName: string;
  onBack: () => void;
}

export function PresetsPage({ userName, onBack }: PresetsPageProps) {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("280 60% 60%");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryColor, setEditCategoryColor] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name: string } | null>(null);

  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");

  const [newPaymentMode, setNewPaymentMode] = useState("");
  const [editingPaymentModeId, setEditingPaymentModeId] = useState<string | null>(null);
  const [editPaymentModeName, setEditPaymentModeName] = useState("");

  const [newMadeFor, setNewMadeFor] = useState("");
  const [editingMadeForId, setEditingMadeForId] = useState<string | null>(null);
  const [editMadeForName, setEditMadeForName] = useState("");

  const { data: presets, isLoading, error } = useQuery<Presets>({
    queryKey: ["/api/presets"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const res = await apiRequest("POST", "/api/categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setNewCategoryName("");
      setNewCategoryColor("280 60% 60%");
      toast({ title: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create category", variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; color?: string } }) => {
      const res = await apiRequest("PATCH", `/api/categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setEditingCategoryId(null);
      toast({ title: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete category", variant: "destructive" });
    },
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: async (data: { categoryId: string; name: string }) => {
      const res = await apiRequest("POST", "/api/subcategories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setNewSubcategoryName("");
      toast({ title: "Subcategory created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create subcategory", variant: "destructive" });
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const res = await apiRequest("PATCH", `/api/subcategories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setEditingSubcategoryId(null);
      toast({ title: "Subcategory updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update subcategory", variant: "destructive" });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/subcategories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      toast({ title: "Subcategory deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete subcategory", variant: "destructive" });
    },
  });

  const createPaymentModeMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest("POST", "/api/payment-modes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setNewPaymentMode("");
      toast({ title: "Payment mode created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create payment mode", variant: "destructive" });
    },
  });

  const updatePaymentModeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const res = await apiRequest("PATCH", `/api/payment-modes/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setEditingPaymentModeId(null);
      toast({ title: "Payment mode updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update payment mode", variant: "destructive" });
    },
  });

  const deletePaymentModeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/payment-modes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      toast({ title: "Payment mode deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete payment mode", variant: "destructive" });
    },
  });

  const createMadeForMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiRequest("POST", "/api/made-for-entities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setNewMadeFor("");
      toast({ title: "Made-for entity created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create made-for entity", variant: "destructive" });
    },
  });

  const updateMadeForMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const res = await apiRequest("PATCH", `/api/made-for-entities/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      setEditingMadeForId(null);
      toast({ title: "Made-for entity updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update made-for entity", variant: "destructive" });
    },
  });

  const deleteMadeForMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/made-for-entities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presets"] });
      toast({ title: "Made-for entity deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete made-for entity", variant: "destructive" });
    },
  });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }
    createCategoryMutation.mutate({
      name: newCategoryName.trim(),
      color: `hsl(${newCategoryColor})`,
    });
  };

  const handleSaveCategory = (id: string) => {
    if (!editCategoryName.trim()) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }
    updateCategoryMutation.mutate({
      id,
      data: { name: editCategoryName.trim(), color: `hsl(${editCategoryColor})` },
    });
  };

  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    const colorValue = category.color?.replace("hsl(", "").replace(")", "") || "280 60% 60%";
    setEditCategoryColor(colorValue);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    
    switch (itemToDelete.type) {
      case "category":
        deleteCategoryMutation.mutate(itemToDelete.id);
        break;
      case "subcategory":
        deleteSubcategoryMutation.mutate(itemToDelete.id);
        break;
      case "paymentMode":
        deletePaymentModeMutation.mutate(itemToDelete.id);
        break;
      case "madeFor":
        deleteMadeForMutation.mutate(itemToDelete.id);
        break;
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleAddSubcategory = () => {
    if (!selectedCategoryForSub) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }
    if (!newSubcategoryName.trim()) {
      toast({ title: "Subcategory name is required", variant: "destructive" });
      return;
    }
    createSubcategoryMutation.mutate({
      categoryId: selectedCategoryForSub,
      name: newSubcategoryName.trim(),
    });
  };

  const handleSaveSubcategory = (id: string) => {
    if (!editSubcategoryName.trim()) {
      toast({ title: "Subcategory name is required", variant: "destructive" });
      return;
    }
    updateSubcategoryMutation.mutate({
      id,
      data: { name: editSubcategoryName.trim() },
    });
  };

  const handleAddPaymentMode = () => {
    if (!newPaymentMode.trim()) {
      toast({ title: "Payment mode name is required", variant: "destructive" });
      return;
    }
    createPaymentModeMutation.mutate({ name: newPaymentMode.trim() });
  };

  const handleSavePaymentMode = (id: string) => {
    if (!editPaymentModeName.trim()) {
      toast({ title: "Payment mode name is required", variant: "destructive" });
      return;
    }
    updatePaymentModeMutation.mutate({
      id,
      data: { name: editPaymentModeName.trim() },
    });
  };

  const handleAddMadeFor = () => {
    if (!newMadeFor.trim()) {
      toast({ title: "Made-for entity name is required", variant: "destructive" });
      return;
    }
    createMadeForMutation.mutate({ name: newMadeFor.trim() });
  };

  const handleSaveMadeFor = (id: string) => {
    if (!editMadeForName.trim()) {
      toast({ title: "Made-for entity name is required", variant: "destructive" });
      return;
    }
    updateMadeForMutation.mutate({
      id,
      data: { name: editMadeForName.trim() },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <UserAvatar name={userName} size="sm" />
              <div>
                <h2 className="text-xl font-semibold">Presets Configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Manage categories and settings
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <Card className="p-6 mb-6 border-destructive">
            <p className="text-destructive">Failed to load presets. Please try again.</p>
          </Card>
        )}

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="categories" data-testid="tab-categories">
              Categories
            </TabsTrigger>
            <TabsTrigger value="subcategories" data-testid="tab-subcategories">
              Subcategories
            </TabsTrigger>
            <TabsTrigger value="payment" data-testid="tab-payment">
              Payment Modes
            </TabsTrigger>
            <TabsTrigger value="madefor" data-testid="tab-madefor">
              Made For
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  data-testid="input-new-category"
                  disabled={createCategoryMutation.isPending}
                />
                <Input
                  placeholder="Color (e.g. 280 60% 60%)"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  data-testid="input-category-color"
                  disabled={createCategoryMutation.isPending}
                  className="max-w-xs"
                />
                <Button
                  onClick={handleAddCategory}
                  data-testid="button-add-category"
                  disabled={createCategoryMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                presets?.categories.map((category) => (
                  <Card key={category.id} className="p-4" data-testid={`card-category-${category.id}`}>
                    {editingCategoryId === category.id ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `hsl(${editCategoryColor})` }}
                        />
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="flex-1"
                          data-testid={`input-edit-category-name-${category.id}`}
                        />
                        <Input
                          value={editCategoryColor}
                          onChange={(e) => setEditCategoryColor(e.target.value)}
                          placeholder="Color (e.g. 280 60% 60%)"
                          className="max-w-xs"
                          data-testid={`input-edit-category-color-${category.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveCategory(category.id)}
                          disabled={updateCategoryMutation.isPending}
                          data-testid={`button-save-category-${category.id}`}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategoryId(null)}
                          disabled={updateCategoryMutation.isPending}
                          data-testid={`button-cancel-edit-category-${category.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: category.color || "hsl(280 60% 60%)",
                            }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartEditCategory(category)}
                            data-testid={`button-edit-${category.name.toLowerCase()}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setItemToDelete({ id: category.id, type: "category", name: category.name });
                              setDeleteDialogOpen(true);
                            }}
                            data-testid={`button-delete-${category.name.toLowerCase()}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Subcategory</h3>
              <div className="flex gap-2">
                <Select
                  value={selectedCategoryForSub}
                  onValueChange={setSelectedCategoryForSub}
                  disabled={createSubcategoryMutation.isPending}
                >
                  <SelectTrigger data-testid="select-category" className="w-64">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets?.categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Subcategory name"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  data-testid="input-new-subcategory"
                  disabled={createSubcategoryMutation.isPending}
                />
                <Button
                  onClick={handleAddSubcategory}
                  data-testid="button-add-subcategory"
                  disabled={createSubcategoryMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <>
                {presets?.categories.map((category) => {
                  const categorySubs = presets.subcategories.filter(
                    (sub) => sub.categoryId === category.id
                  );
                  if (categorySubs.length === 0 && !selectedCategoryForSub) return null;
                  if (selectedCategoryForSub && category.id !== selectedCategoryForSub) return null;

                  return (
                    <Card key={category.id} className="p-6">
                      <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySubs.map((sub) => (
                          <div key={sub.id}>
                            {editingSubcategoryId === sub.id ? (
                              <div className="flex items-center gap-2 border rounded-md p-2">
                                <Input
                                  value={editSubcategoryName}
                                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                                  className="w-40"
                                  data-testid={`input-edit-subcategory-${sub.id}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSaveSubcategory(sub.id)}
                                  disabled={updateSubcategoryMutation.isPending}
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingSubcategoryId(null)}
                                  disabled={updateSubcategoryMutation.isPending}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="px-3 py-1.5 gap-2"
                                data-testid={`badge-${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {sub.name}
                                <button
                                  onClick={() => {
                                    setEditingSubcategoryId(sub.id);
                                    setEditSubcategoryName(sub.name);
                                  }}
                                  className="hover:text-primary"
                                  data-testid={`button-edit-subcategory-${sub.id}`}
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => {
                                    setItemToDelete({ id: sub.id, type: "subcategory", name: sub.name });
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="hover:text-destructive"
                                  data-testid={`button-delete-subcategory-${sub.id}`}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-3">
            <Card className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New payment mode"
                  value={newPaymentMode}
                  onChange={(e) => setNewPaymentMode(e.target.value)}
                  data-testid="input-new-payment"
                  disabled={createPaymentModeMutation.isPending}
                />
                <Button
                  onClick={handleAddPaymentMode}
                  data-testid="button-add-payment"
                  disabled={createPaymentModeMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              presets?.paymentModes.map((mode) => (
                <Card key={mode.id} className="p-4">
                  {editingPaymentModeId === mode.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editPaymentModeName}
                        onChange={(e) => setEditPaymentModeName(e.target.value)}
                        className="flex-1"
                        data-testid={`input-edit-payment-${mode.id}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSavePaymentMode(mode.id)}
                        disabled={updatePaymentModeMutation.isPending}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPaymentModeId(null)}
                        disabled={updatePaymentModeMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{mode.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingPaymentModeId(mode.id);
                            setEditPaymentModeName(mode.name);
                          }}
                          data-testid={`button-edit-payment-${mode.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setItemToDelete({ id: mode.id, type: "paymentMode", name: mode.name });
                            setDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-payment-${mode.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="madefor" className="space-y-3">
            <Card className="p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New entity"
                  value={newMadeFor}
                  onChange={(e) => setNewMadeFor(e.target.value)}
                  data-testid="input-new-madefor"
                  disabled={createMadeForMutation.isPending}
                />
                <Button
                  onClick={handleAddMadeFor}
                  data-testid="button-add-madefor"
                  disabled={createMadeForMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              presets?.madeFor.map((entity) => (
                <Card key={entity.id} className="p-4">
                  {editingMadeForId === entity.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editMadeForName}
                        onChange={(e) => setEditMadeForName(e.target.value)}
                        className="flex-1"
                        data-testid={`input-edit-madefor-${entity.id}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveMadeFor(entity.id)}
                        disabled={updateMadeForMutation.isPending}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingMadeForId(null)}
                        disabled={updateMadeForMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{entity.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingMadeForId(entity.id);
                            setEditMadeForName(entity.name);
                          }}
                          data-testid={`button-edit-madefor-${entity.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setItemToDelete({ id: entity.id, type: "madeFor", name: entity.name });
                            setDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-madefor-${entity.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{itemToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
