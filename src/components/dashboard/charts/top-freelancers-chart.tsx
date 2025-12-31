"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const topFreelancers = [
  { name: "Sarah Johnson", rating: 4.9, reviews: 128, avatar: "" },
  { name: "Michael Chen", rating: 4.9, reviews: 115, avatar: "" },
  { name: "Emily Davis", rating: 4.8, reviews: 98, avatar: "" },
  { name: "James Wilson", rating: 4.8, reviews: 87, avatar: "" },
  { name: "Anna Martinez", rating: 4.7, reviews: 76, avatar: "" },
];

export function TopFreelancersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Rated Freelancers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topFreelancers.map((freelancer, index) => (
            <div
              key={freelancer.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-4">
                  {index + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={freelancer.avatar} />
                  <AvatarFallback>
                    {freelancer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{freelancer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {freelancer.reviews} reviews
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{freelancer.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
