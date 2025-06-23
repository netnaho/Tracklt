"use client";

import { AppLayout } from "@/components/app-layout";
import { CategoryManager } from "@/components/category-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <Card>
           <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>
              Add, edit, or delete your expense categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryManager />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
