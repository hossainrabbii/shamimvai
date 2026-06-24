"use client";

import { Users, Clock, CheckCircle2, Wallet, TrendingUp } from "lucide-react";

export default function AdminStatCard() {
  // ৪টি কার্ডের র ডেটা এবং কনফিগারেশন এখানে একসাথে সেট করা হয়েছে
  const statsData = [
    {
      id: "total",
      icon: Users,
      label: "মোট আবেদন",
      value:  0,
      tone: "primary",
    },
    {
      id: "pending",
      icon: Clock,
      label: "পেন্ডিং",
      value: 0,
      tone: "warning",
    },
    {
      id: "approved",
      icon: CheckCircle2,
      label: "অনুমোদিত",
      value:  0,
      tone: "success",
    },
    {
      id: "revenue",
      icon: Wallet,
      label: "মোট আয় (৳)",
      value: 0,
      tone: "accent",
    },
  ];

  // বিভিন্ন টোনের টেলউইন্ড ক্লাস ম্যাপ
  const tones = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/15 text-success",
    accent: "bg-accent/15 text-accent",
  };

  return (
  <div className="container mx-auto bg-secondary/30 font-bangla mt-4">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            
            <p className="mt-3 text-3xl font-bold text-foreground">
              {card.value.toLocaleString("bn-BD")}
            </p>
            
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> রিয়েল-টাইম আপডেট
            </p>
          </div>
        );
      })}
    </div>
    </div> 
  );
}