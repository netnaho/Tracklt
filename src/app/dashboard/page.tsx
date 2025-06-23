"use client";

import { AppLayout } from '@/components/app-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { CategoryPieChart } from '@/components/dashboard/category-pie-chart';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <StatsCards />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-12 lg:col-span-4">
            <OverviewChart />
          </div>
          <div className="col-span-12 lg:col-span-3">
             <CategoryPieChart />
          </div>
        </div>
        <RecentExpenses />
      </div>
    </AppLayout>
  );
}
