"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { category: "Web Development", count: 85 },
  { category: "Mobile Apps", count: 72 },
  { category: "UI/UX Design", count: 65 },
  { category: "Data Science", count: 48 },
  { category: "DevOps", count: 42 },
  { category: "Content Writing", count: 38 },
  { category: "Digital Marketing", count: 35 },
  { category: "Video Editing", count: 28 },
  { category: "SEO", count: 25 },
  { category: "Graphic Design", count: 22 },
];

export function ProjectCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={200}
          >
            <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
