"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, Briefcase, FileText, GraduationCap } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "registration",
    user: "John Doe",
    action: "registered as a freelancer",
    time: new Date(Date.now() - 1000 * 60 * 2),
    icon: UserPlus,
  },
  {
    id: 2,
    type: "project",
    user: "Sarah Smith",
    action: "posted a new project",
    details: "E-commerce Website Development",
    time: new Date(Date.now() - 1000 * 60 * 15),
    icon: Briefcase,
  },
  {
    id: 3,
    type: "offer",
    user: "Mike Johnson",
    action: "submitted an offer",
    details: "$500 for Mobile App",
    time: new Date(Date.now() - 1000 * 60 * 30),
    icon: FileText,
  },
  {
    id: 4,
    type: "course",
    user: "Emily Brown",
    action: "published a new course",
    details: "React Fundamentals",
    time: new Date(Date.now() - 1000 * 60 * 60),
    icon: GraduationCap,
  },
  {
    id: 5,
    type: "registration",
    user: "Alex Wilson",
    action: "registered as a customer",
    time: new Date(Date.now() - 1000 * 60 * 90),
    icon: UserPlus,
  },
  {
    id: 6,
    type: "offer",
    user: "Lisa Chen",
    action: "accepted an offer",
    details: "Web Development Project",
    time: new Date(Date.now() - 1000 * 60 * 120),
    icon: FileText,
  },
  {
    id: 7,
    type: "project",
    user: "David Lee",
    action: "completed a project",
    details: "Logo Design",
    time: new Date(Date.now() - 1000 * 60 * 180),
    icon: Briefcase,
  },
  {
    id: 8,
    type: "registration",
    user: "Emma Davis",
    action: "registered as a contributor",
    time: new Date(Date.now() - 1000 * 60 * 240),
    icon: UserPlus,
  },
];

const typeColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  registration: "default",
  project: "secondary",
  offer: "success",
  course: "warning",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user}</span>
                      <Badge variant={typeColors[activity.type]} className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                      {activity.details && (
                        <span className="font-medium text-foreground">
                          {" "}
                          - {activity.details}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.time, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
