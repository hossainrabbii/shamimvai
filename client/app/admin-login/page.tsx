"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { UserService } from "@/services/user";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "অ্যাডমিন লগইন — Shamim Vai";
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);    

    try {
      // 🚀 রিয়েল এপিআই সার্ভিসের মাধ্যমে লগইন রিকোয়েস্ট
      const result = await UserService.loginUser({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (result && result.success) {
        const user = result.data.user;

        // 🔐 রোল (Role) ভেরিফিকেশন চেক
        if (user.role !== "admin") {
          toast.error("আপনার কাছে অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই!");
          setLoading(false);
          return;
        }

        // টোকেন ও ডাটা স্টোর করা
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("সফলভাবে লগইন হয়েছে");
        router.push("/admin"); // অ্যাডমিন পেজে রিডাইরেক্ট
      } else {
        toast.error(result?.message || "ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।");
        setLoading(false);
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      toast.error("সার্ভার সমস্যা! অনুগ্রহ করে পরে চেষ্টা করুন।");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-4 font-bangla">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              নিয়ন্ত্রণ প্যানেলে প্রবেশ করতে ইমেইল ও পাসওয়ার্ড দিন
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {/* ইমেইল ফিল্ড */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">অ্যাডমিন ইমেইল</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {/* পাসওয়ার্ড ফিল্ড */}
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

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="h-11 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-md hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> যাচাই হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> প্রবেশ করুন
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              ← হোমে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}