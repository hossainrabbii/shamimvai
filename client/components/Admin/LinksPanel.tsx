"use client";

import { useState } from "react";
import { Video, FileQuestion, Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ClassLinks } from "../AdminDashboard";

export default function LinksPanel() {
  const [live, setLive] = useState("");
  const [exam, setExam] = useState("");
  const [savedLinks, setSavedLinks] = useState<ClassLinks>({ liveUrl: "", examUrl: "", updatedAt: "" });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedLinks({
      liveUrl: live,
      examUrl: exam,
      updatedAt: new Date().toISOString()
    });
    toast.success("লিংক সেভ হয়েছে");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
        <div className="mb-5 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent"><Video className="h-5 w-5" /></div>
          <div>
            <h3 className="font-bold text-foreground">আজকের লিংক ম্যানেজ করুন</h3>
            <p className="text-xs text-muted-foreground">শিক্ষার্থীদের ড্যাশবোর্ডে এই লিংকগুলো দেখাবে</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="live" className="text-sm"><Video className="mr-1 inline h-4 w-4" /> লাইভ ক্লাসের লিংক</Label>
            <Input id="live" type="url" value={live} onChange={(e) => setLive(e.target.value)} placeholder="https://zoom.us/j/..." className="mt-2 h-11 font-mono text-sm" />
          </div>
          <div>
            <Label htmlFor="exam" className="text-sm"><FileQuestion className="mr-1 inline h-4 w-4" /> পরীক্ষার লিংক</Label>
            <Input id="exam" type="url" value={exam} onChange={(e) => setExam(e.target.value)} placeholder="https://forms.gle/..." className="mt-2 h-11 font-mono text-sm" />
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="bg-success text-success-foreground hover:bg-success/90 px-6">
            <Save className="mr-2 h-4 w-4" /> সেভ করুন
          </Button>
          {savedLinks.updatedAt && (
            <span className="text-xs text-muted-foreground">
              সর্বশেষ আপডেট: {new Date(savedLinks.updatedAt).toLocaleString("bn-BD", { timeStyle: "short", dateStyle: "short" })}
            </span>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Video className="h-4 w-4 text-muted-foreground" /> লাইভ ক্লাস লিংক</div>
        {savedLinks.liveUrl ? (
          <a href={savedLinks.liveUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 break-all text-sm text-primary hover:underline">
            {savedLinks.liveUrl} <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">এখনো সেট করা হয়নি।</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><FileQuestion className="h-4 w-4 text-muted-foreground" /> পরীক্ষা লিংক</div>
        {savedLinks.examUrl ? (
          <a href={savedLinks.examUrl} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 break-all text-sm text-primary hover:underline">
            {savedLinks.examUrl} <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">এখনো সেট করা হয়নি।</p>
        )}
      </div>
    </div>
  );
}