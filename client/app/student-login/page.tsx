"use client";

import { useState } from "react";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"; 
import { UserService } from "@/services/user";

export default function StudentLoginPage() {
  const router = useRouter(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ফর্ম সাবমিট হ্যান্ডলার
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
    const result = await UserService.loginUser({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (result && result.success) {
      localStorage.setItem("token", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      // toast.success(`স্বাগতম, ${result.data.user.name}!`);
      
      router.push("/student"); 
    } else {
      toast.error(result?.message || "লগইন করতে ব্যর্থ হয়েছে।");
      setLoading(false);
    }
    } catch (error) {
      console.error("Login Client Error:", error);
      toast.error("নেটওয়ার্ক সমস্যা! অনুগ্রহ করে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-accent/10 via-background to-primary/10 px-4 font-bangla">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-success text-accent-foreground shadow-lg">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">শিক্ষার্থী পোর্টাল</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              আপনার রেজিস্টার্ড ইমেইল ও পাসওয়ার্ড দিয়ে লগ隐ন করুন
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* ইমেইল ইনপুট */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">ইমেইল এড্রেস</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoFocus
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {/* পাসওয়ার্ড ইনপুট */}
            <div className="space-y-2">
              <Label htmlFor="pw" className="text-sm font-medium">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="pw"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {/* সাবমিট বাটন */}
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="h-11 w-full bg-gradient-to-r from-accent to-success text-accent-foreground shadow-md hover:opacity-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> যাচাই হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> লগইন করুন
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            এখনো ভর্তি হননি?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              এখনী ভর্তি হোন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}