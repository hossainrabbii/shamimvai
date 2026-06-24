"use client";

import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-foreground">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-xs text-muted-foreground">নিয়ন্ত্রণ প্যানেল</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/"><Button variant="outline" size="sm">← হোম</Button></Link>
          <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="mr-1.5 h-4 w-4" /> লগআউট</Button>
        </div>
      </div>
    </header>
  );
}