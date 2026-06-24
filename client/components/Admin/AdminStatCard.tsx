"use client";

import { Users, Clock, CheckCircle2, Wallet, TrendingUp } from "lucide-react";
import { Enrollment } from "../AdminDashboard"; // আপনার সঠিক পাথ অনুযায়ী ইম্পোর্ট করে নিন

interface AdminStatCardProps {
  enrollments: Enrollment[];
}

export default function AdminStatCard({ enrollments }: any) {
  const safeEnrollments = Array.isArray(enrollments?.data) ? enrollments.data : [];
  
  const totalApplications = safeEnrollments.length;
  
  const pendingCount = safeEnrollments.filter((e: any) => e.status === "pending").length;
  
 
  const approvedCount = safeEnrollments.filter((e: any) => e.status === "approved").length;
  
  
  const totalRevenue = safeEnrollments
    .filter((e: any) => e.status === "approved")
    .reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);

  // ২. ৪টি কার্ডের ডাটা কনফিগারেশন
  const statsData = [
    {
      id: "total",
      icon: Users,
      label: "মোট আবেদন",
      value: totalApplications, // 👈 এখন এটি পারফেক্টলি ডাটা রিড করবে
      tone: "primary",
    },
    {
      id: "pending",
      icon: Clock,
      label: "পেন্ডিং",
      value: pendingCount,
      tone: "warning",
    },
    {
      id: "approved",
      icon: CheckCircle2,
      label: "অনুমোদিত",
      value: approvedCount,
      tone: "success",
    },
    {
      id: "revenue",
      icon: Wallet,
      label: "মোট আয় (৳)",
      value: totalRevenue,
      tone: "accent",
    },
  ];
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/15 text-success",
    accent: "bg-accent/15 text-accent",
  };

  return (
    <div className="container mx-auto font-bangla mt-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((card) => {
          const Icon = card.icon;
          
          // আইকন বক্সের ব্যাকগ্রাউন্ড কালার ডাইনামিক করা হলো
          const iconColorClass = tones[card.tone] || "bg-secondary text-foreground";

          return (
            <div key={card.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{card.label}</span>
                {/* 🛠️ এখানে ফিক্স করা হলো: ডাইনামিক কালার ক্লাস অ্যাসাইন করা হয়েছে */}
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconColorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              
              <p className="mt-3 text-3xl font-bold text-foreground">
                {card.value.toLocaleString("bn-BD")}
              </p>
              
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-success" /> রিয়েল-টাইম আপডেট
              </p>
            </div>
          );
        })}
      </div>
    </div> 
  );
}