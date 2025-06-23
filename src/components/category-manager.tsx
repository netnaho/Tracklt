"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

import { useApp, getIcon } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryManager() {
  const { categories, addCategory, deleteCategory, expenses } = useApp();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: CategoryFormValues) {
    addCategory({ name: data.name, icon: 'Plus' });
    form.reset();
  }
  
  const canDelete = (categoryName: string) => {
    return !expenses.some(exp => exp.category === categoryName);
  }

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Enter new category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </Form>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Existing Categories</h3>
        {categories.length > 0 ? (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  {getIcon(category.icon)}
                  <span>{category.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(category.id)}
                  disabled={!canDelete(category.name)}
                  title={canDelete(category.name) ? "Delete category" : "Cannot delete category with associated expenses"}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No categories found.</p>
        )}
      </div>
    </div>
  );
}
