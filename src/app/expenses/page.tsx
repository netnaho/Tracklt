"use client";

import { useState } from "react";
import { PlusCircle, Download } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/app-provider";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { exportToCsv } from "@/lib/utils";

export default function ExpensesPage() {
  const { expenses } = useApp();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const handleExport = () => {
    exportToCsv(expenses, "expenses.csv");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddExpenseOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Expenses</CardTitle>
            <CardDescription>
              A detailed list of all your recorded transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={expenses} />
          </CardContent>
        </Card>
      </div>
      <AddExpenseDialog isOpen={isAddExpenseOpen} setIsOpen={setIsAddExpenseOpen} />
    </AppLayout>
  );
}
