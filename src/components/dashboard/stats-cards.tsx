"use client";

import { useApp } from "@/context/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { useMemo } from "react";

export function StatsCards() {
  const { expenses } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const expensesThisMonth = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((acc, exp) => acc + exp.amount, 0);

    const expensesThisYear = expenses
      .filter(exp => new Date(exp.date).getFullYear() === currentYear)
      .reduce((acc, exp) => acc + exp.amount, 0);
      
    const averageTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    return { totalExpenses, expensesThisMonth, expensesThisYear, averageTransaction };
  }, [expenses]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">Overall spending</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.expensesThisMonth)}</div>
           <p className="text-xs text-muted-foreground">Expenses in {new Date().toLocaleString('default', { month: 'long' })}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Year</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.expensesThisYear)}</div>
          <p className="text-xs text-muted-foreground">Expenses in {new Date().getFullYear()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.averageTransaction)}</div>
          <p className="text-xs text-muted-foreground">Average per expense record</p>
        </CardContent>
      </Card>
    </div>
  );
}
