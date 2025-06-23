"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useApp } from "@/context/app-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function OverviewChart() {
  const { expenses } = useApp();

  const data = useMemo(() => {
    const monthlyTotals: { [key: string]: number } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize months
    for(let i=0; i<12; i++) {
        const monthKey = `${new Date().getFullYear()}-${i}`;
        monthlyTotals[monthKey] = 0;
    }
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyTotals[monthKey] !== undefined) {
         monthlyTotals[monthKey] += expense.amount;
      }
    });

    return Object.keys(monthlyTotals).map(monthKey => {
        const [year, month] = monthKey.split('-');
        return {
          name: monthNames[parseInt(month)],
          total: monthlyTotals[monthKey],
        }
    }).slice(0,12); // ensure we only show 12 months for the current year
  }, [expenses]);

  return (
    <Card className="w-full">
       <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Your spending summary for the year.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              formatter={(value) => [formatCurrency(value as number), 'Total']}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
