"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useApp } from "@/context/app-provider";
import { cn } from "@/lib/utils";
import type { Expense } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { getCategorySuggestion } from "@/lib/actions";

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface AddExpenseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  expense?: Expense;
}

export function AddExpenseDialog({ isOpen, setIsOpen, expense }: AddExpenseDialogProps) {
  const { categories, addExpense, updateExpense } = useApp();
  const { toast } = useToast();
  const [isSuggestionLoading, startSuggestionTransition] = useTransition();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? { ...expense, amount: Number(expense.amount), date: new Date(expense.date) }
      : {
          description: "",
          amount: 0,
          category: "",
          date: new Date(),
        },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    const expenseData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };
    if (expense) {
      updateExpense({ ...expense, ...expenseData });
      toast({ title: "Expense updated successfully" });
    } else {
      addExpense(expenseData);
      toast({ title: "Expense added successfully" });
    }
    setIsOpen(false);
    form.reset();
  };

  const handleSuggestion = async () => {
    const description = form.getValues("description");
    if (!description) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Please enter a description to get a suggestion.",
        });
      return;
    }
    
    const formData = new FormData();
    formData.append("description", description);

    startSuggestionTransition(async () => {
      const result = await getCategorySuggestion(formData);
      if (result.error) {
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: result.error,
        });
      } else if (result.suggestion) {
        const matchedCategory = categories.find(c => c.name.toLowerCase() === result.suggestion.toLowerCase())
        if (matchedCategory) {
            form.setValue("category", matchedCategory.name);
            toast({ title: "Category suggestion applied!" });
        } else {
             toast({ title: "Suggestion found", description: `Suggested category: ${result.suggestion}. You can add it if needed.` });
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            {expense ? "Update the details of your expense." : "Enter the details of your new expense."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coffee with a friend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                     <FormLabel className="mb-2">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={handleSuggestion} disabled={isSuggestionLoading}>
                      {isSuggestionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      <span className="sr-only">Suggest Category</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {expense ? "Save Changes" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
