"use client";

import { useState } from "react";
import { Megaphone, Send, Trash2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Notice } from "../AdminDashboard";

export default function NoticesPanel() {
  const [text, setText] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newNotice: Notice = {
      id: Date.now().toString(),
      text: text,
      createdAt: new Date().toISOString()
    };
    setNotices(prev => [newNotice, ...prev]);
    setText("");
    toast.success("নোটিশ প্রকাশিত হয়েছে");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <form onSubmit={handlePublish} className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/20 text-warning-foreground">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">নতুন নোটিশ লিখুন</h3>
            <p className="text-xs text-muted-foreground">সকল শিক্ষার্থী দেখতে পাবে</p>
          </div>
        </div>
        <Label htmlFor="notice" className="text-sm">নোটিশ</Label>
        <Textarea id="notice" value={text} onChange={(e) => setText(e.target.value)} placeholder="যেমন: আজ রাত ৯টায় পরীক্ষা নেওয়া হবে" rows={5} className="mt-2" />
        <Button type="submit" disabled={!text.trim()} className="mt-4 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          <Send className="mr-2 h-4 w-4" /> Publish Notice
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
        <h3 className="mb-4 font-bold text-foreground">প্রকাশিত নোটিশসমূহ</h3>
        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">এখনো কোনো নোটিশ প্রকাশ করা হয়নি।</div>
        ) : (
          <ul className="space-y-3">
            {notices.map((n, idx) => (
              <li key={n.id} className={`rounded-xl border p-4 ${idx === 0 ? "border-warning/40 bg-warning/10" : "border-border bg-secondary/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 text-sm leading-relaxed text-foreground">{n.text}</p>
                  <button onClick={() => setNotices(prev => prev.filter(item => item.id !== n.id))} className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}