"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Megaphone,
  Video,
  BookOpen,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { Toaster } from "@/components/ui/sonner";
import DashboardHeader from "./Admin/AdminHeader";
import NoticesPanel from "./Admin/NoticesPanel";
import LinksPanel from "./Admin/LinksPanel";
import CoursesPanel from "./Admin/CoursePanel";
import AdminStatCard from "./Admin/AdminStatCard";
import { Button } from "./ui/button";
import VerificationsPanel from "./VerificationsPanel";

export interface Enrollment {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  courseId: {
    _id: string;
    name: string;
    price: number;
  } | null;
  paidNumber: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface AdminDashboardProps {
  enrollments: any;
}

export default function AdminDashboard({
  enrollments,
}: AdminDashboardProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        setAuthed(user?.role === "admin");
      } catch {
        setAuthed(false);
      }
    } else {
      setAuthed(false);
    }

    document.title = "অ্যাডমিন ড্যাশবোর্ড — Shamim Vai";
  }, []);

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary/30 px-4 font-bangla">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-foreground">
            অ্যাক্সেস ডিনাইড
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            এই পেজে প্রবেশের জন্য অ্যাডমিন লগইন প্রয়োজন।
          </p>

          <Button
            onClick={() => router.push("/admin-login")}
            className="mt-6 w-full"
          >
            লগইন পেজে যান
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 font-bangla">
      <Toaster richColors position="top-center" />

      <DashboardHeader
        onLogout={() => {
          localStorage.clear();
          router.push("/admin-login");
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <AdminStatCard enrollments={enrollments}/>

        <Tabs defaultValue="verifications" className="mt-8 flex-col">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-muted p-2 rounded-xl">
  <TabsTrigger
    value="verifications"
    className="
      gap-1.5 rounded-lg px-4 py-2 transition-all
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
  >
    <CheckCircle2 className="h-4 w-4" />
    ভেরিফিকেশন
  </TabsTrigger>

  <TabsTrigger
    value="notices"
    className="
      gap-1.5 rounded-lg px-4 py-2 transition-all
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
  >
    <Megaphone className="h-4 w-4" />
    নোটিশ
  </TabsTrigger>

  <TabsTrigger
    value="links"
    className="
      gap-1.5 rounded-lg px-4 py-2 transition-all
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
  >
    <Video className="h-4 w-4" />
    লাইভ ও পরীক্ষা
  </TabsTrigger>

  <TabsTrigger
    value="courses"
    className="
      gap-1.5 rounded-lg px-4 py-2 transition-all
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
  >
    <BookOpen className="h-4 w-4" />
    কোর্স
  </TabsTrigger>
</TabsList>

          <TabsContent value="verifications" className="mt-4">
            <VerificationsPanel enrollments={enrollments} />
          </TabsContent>

          <TabsContent value="notices" className="mt-4">
            <NoticesPanel />
          </TabsContent>

          <TabsContent value="links" className="mt-4">
            <LinksPanel />
          </TabsContent>

          <TabsContent value="courses" className="mt-4">
            <CoursesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}