"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { UserGrowthChart } from "@/components/dashboard/charts/user-growth-chart";
import { ProjectStatusChart } from "@/components/dashboard/charts/project-status-chart";
import { ProjectCategoryChart } from "@/components/dashboard/charts/project-category-chart";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { TopFreelancersChart } from "@/components/dashboard/charts/top-freelancers-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  DollarSign,
  Star,
  UserPlus,
  FolderPlus,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline" size="sm">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Users"
          value="2,847"
          description="750 customers, 580 freelancers, 140 contributors"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Projects"
          value="456"
          description="45 active projects"
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Offers"
          value="1,234"
          description="68% acceptance rate"
          icon={FileText}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Total Courses"
          value="89"
          description="2,450 total learners"
          icon={GraduationCap}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Platform Revenue"
          value="$72,000"
          description="from completed projects"
          icon={DollarSign}
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          title="Avg. Rating"
          value="4.7"
          description="based on 1,850 reviews"
          icon={Star}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <UserGrowthChart />
        <ProjectStatusChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <ProjectCategoryChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopFreelancersChart />
        <ActivityFeed />
      </div>
    </div>
  );
}
