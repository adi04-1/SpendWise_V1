import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DataViewer } from "@/components/admin/DataViewer";
import { UserManagement } from "@/components/admin/UserManagement";
import { ColorEditor } from "@/components/admin/ColorEditor";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
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
              <div>
                <h2 className="text-xl font-semibold">Admin Panel</h2>
                <p className="text-sm text-muted-foreground">
                  Manage data, users, and app settings
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="data" data-testid="tab-data">
              Data
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              Users
            </TabsTrigger>
            <TabsTrigger value="colors" data-testid="tab-colors">
              Colors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <DataViewer />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <ColorEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
