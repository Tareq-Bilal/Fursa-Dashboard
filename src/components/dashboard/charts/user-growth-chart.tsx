"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const data = [
  { month: "Jan", customers: 120, freelancers: 80, contributors: 20 },
  { month: "Feb", customers: 150, freelancers: 100, contributors: 25 },
  { month: "Mar", customers: 180, freelancers: 130, contributors: 35 },
  { month: "Apr", customers: 220, freelancers: 160, contributors: 40 },
  { month: "May", customers: 280, freelancers: 200, contributors: 50 },
  { month: "Jun", customers: 350, freelancers: 250, contributors: 60 },
  { month: "Jul", customers: 400, freelancers: 300, contributors: 70 },
  { month: "Aug", customers: 450, freelancers: 340, contributors: 80 },
  { month: "Sep", customers: 520, freelancers: 400, contributors: 95 },
  { month: "Oct", customers: 600, freelancers: 460, contributors: 110 },
  { month: "Nov", customers: 680, freelancers: 520, contributors: 125 },
  { month: "Dec", customers: 750, freelancers: 580, contributors: 140 },
];

export function UserGrowthChart() {
  const [timeRange, setTimeRange] = useState("12");

  const filteredData = data.slice(-parseInt(timeRange));

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Growth</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
                name="Customers"
              />
              <Line
                type="monotone"
                dataKey="freelancers"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E" }}
                name="Freelancers"
              />
              <Line
                type="monotone"
                dataKey="contributors"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B" }}
                name="Contributors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
