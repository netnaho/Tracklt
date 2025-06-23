"use client"

import { useApp, getIcon } from "@/context/app-provider"
import { formatCurrency } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentExpenses() {
  const { expenses, categories } = useApp();

  const recentExpenses = expenses
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

   const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? getIcon(category.icon) : null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>
          Your five most recent transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div className="font-medium">{expense.description}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    {getCategoryIcon(expense.category)}
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
