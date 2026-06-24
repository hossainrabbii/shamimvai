"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  ExternalLink,
  Trash2,
  Filter,
  Wallet,
  LogOut,
  Megaphone,
  Video,
  FileQuestion,
  Send,
  Save,
  ShieldCheck,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  approveEnrollment,
  deleteEnrollment,
  Enrollment,
  listEnrollments,
  subscribe,
} from "@/lib/enrollments";
import { adminLogout, isAdminAuthed } from "@/lib/admin-auth";
import {
  deleteNotice,
  getLinks,
  listNotices,
  publishNotice,
  saveLinks,
  subscribeCms,
  type ClassLinks,
  type Notice,
} from "@/lib/cms";

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAdminAuthed());
  }, []);

  useEffect(() => {
    document.title = "অ্যাডমিন ড্যাশবোর্ড — Shamim Vai";
  }, []);

  if (authed === null) return null;

  if (!authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary/30 px-4 font-bangla">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">অ্যাক্সেস ডিনাইড</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            এই পেজে প্রবেশের জন্য অ্যাডমিন লগইন প্রয়োজন।
          </p>
          <Button
            onClick={() => router.push("/admin-login")}
            className="mt-6 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
          >
            লগইন পেজে যান
          </Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => router.push("/admin-login")} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    setItems(listEnrollments());
    return subscribe(() => setItems(listEnrollments()));
  }, []);

  const stats = useMemo(() => {
    const pending = items.filter((i) => i.status === "pending").length;
    const approved = items.filter((i) => i.status === "approved").length;
    const revenue = items.filter((i) => i.status === "approved").reduce((s, i) => s + i.amount, 0);
    return { total: items.length, pending, approved, revenue };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.phone.includes(q) ||
        i.trxId.toLowerCase().includes(q) ||
        i.facebook.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  return (
    <div className="min-h-screen bg-secondary/30 font-bangla">
      <Toaster richColors position="top-center" />
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
            <Link href="/">
              <Button variant="outline" size="sm">← হোম</Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                adminLogout();
                toast.success("লগআউট সম্পন্ন হয়েছে");
                onLogout();
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" /> লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="মোট আবেদন" value={stats.total} tone="primary" />
          <StatCard icon={Clock} label="পেন্ডিং" value={stats.pending} tone="warning" />
          <StatCard icon={CheckCircle2} label="অনুমোদিত" value={stats.approved} tone="success" />
          <StatCard icon={Wallet} label="মোট আয় (৳)" value={stats.revenue} tone="accent" />
        </div>

       <div> 
        <Tabs defaultValue="verifications" className="mt-8">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-card p-1 shadow-sm sm:w-auto">
            <TabsTrigger value="verifications" className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> ভেরিফিকেশন
            </TabsTrigger>
            <TabsTrigger value="notices" className="gap-1.5">
              <Megaphone className="h-4 w-4" /> নোটিশ
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-1.5">
              <Video className="h-4 w-4" /> লাইভ ও পরীক্ষা
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="mt-4">
            <VerificationsPanel
              query={query}
              setQuery={setQuery}
              filter={filter}
              setFilter={setFilter}
              filtered={filtered}
            />
          </TabsContent>

          <TabsContent value="notices" className="mt-4">
            <NoticesPanel />
          </TabsContent>

          <TabsContent value="links" className="mt-4">
            <LinksPanel />
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}

/* ---------- Verifications ---------- */
function VerificationsPanel({
  query,
  setQuery,
  filter,
  setFilter,
  filtered,
}: {
  query: string;
  setQuery: (v: string) => void;
  filter: "all" | "pending" | "approved";
  setFilter: (v: "all" | "pending" | "approved") => void;
  filtered: Enrollment[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="নাম, ফোন, TrxID..."
            className="h-10 pl-10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          <Filter className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "সব" : f === "pending" ? "পেন্ডিং" : "অনুমোদিত"}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <Th>শিক্ষার্থী</Th>
              <Th>ফোন</Th>
              <Th>Facebook</Th>
              <Th>Sender</Th>
              <Th>TrxID</Th>
              <Th>সময়</Th>
              <Th>স্ট্যাটাস</Th>
              <Th className="text-right">অ্যাকশন</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-muted-foreground">
                  কোনো আবেদন পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-secondary/40">
                  <Td><div className="font-semibold text-foreground">{e.name}</div></Td>
                  <Td className="font-mono text-xs">{e.phone}</Td>
                  <Td><FacebookCell value={e.facebook} /></Td>
                  <Td className="font-mono text-xs">{e.senderNumber}</Td>
                  <Td className="font-mono text-xs font-semibold">{e.trxId}</Td>
                  <Td className="text-xs text-muted-foreground">{formatTime(e.submittedAt)}</Td>
                  <Td><StatusBadge status={e.status} /></Td>
                  <Td className="text-right"><RowActions row={e} /></Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">কোনো আবেদন নেই।</p>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{e.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{e.phone}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Info label="TrxID" value={e.trxId} mono />
                <Info label="Sender" value={e.senderNumber} mono />
                <Info label="Facebook" value={e.facebook} />
                <Info label="সময়" value={formatTime(e.submittedAt)} />
              </div>
              <div className="mt-3 flex justify-end"><RowActions row={e} /></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Notices ---------- */
function NoticesPanel() {
  const [text, setText] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    setNotices(listNotices());
    return subscribeCms(() => setNotices(listNotices()));
  }, []);

  function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    publishNotice(text);
    setText("");
    toast.success("নোটিশ প্রকাশিত হয়েছে");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <form
        onSubmit={handlePublish}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
      >
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
        <Textarea
          id="notice"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="যেমন: আজ রাত ৯টায় পরীক্ষা নেওয়া হবে"
          rows={5}
          className="mt-2"
        />
        <Button
          type="submit"
          disabled={!text.trim()}
          className="mt-4 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground"
        >
          <Send className="mr-2 h-4 w-4" /> Publish Notice
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
        <h3 className="mb-4 font-bold text-foreground">প্রকাশিত নোটিশসমূহ</h3>
        {notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            এখনো কোনো নোটিশ প্রকাশ করা হয়নি।
          </div>
        ) : (
          <ul className="space-y-3">
            {notices.map((n, idx) => (
              <li
                key={n.id}
                className={`rounded-xl border p-4 ${
                  idx === 0
                    ? "border-warning/40 bg-warning/10"
                    : "border-border bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 text-sm leading-relaxed text-foreground">{n.text}</p>
                  <button
                    onClick={() => {
                      if (confirm("নোটিশ মুছবেন?")) {
                        deleteNotice(n.id);
                        toast.success("মুছে ফেলা হয়েছে");
                      }
                    }}
                    className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  {formatTime(n.createdAt)}
                  {idx === 0 && (
                    <span className="ml-2 rounded-full bg-warning/30 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">
                      LATEST
                    </span>
                  )}
                </p>
              </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Links ---------- */
function LinksPanel() {
  const [links, setLinks] = useState<ClassLinks>({ liveUrl: "", examUrl: "", updatedAt: "" });
  const [live, setLive] = useState("");
  const [exam, setExam] = useState("");

  useEffect(() => {
    const initial = getLinks();
    setLinks(initial);
    setLive(initial.liveUrl);
    setExam(initial.examUrl);
    return subscribeCms(() => {
      const next = getLinks();
      setLinks(next);
    });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const saved = saveLinks(live, exam);
    setLinks(saved);
    toast.success("লিংক সেভ হয়েছে");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
      >
        <div className="mb-5 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">আজকের লিংক ম্যানেজ করুন</h3>
            <p className="text-xs text-muted-foreground">
              শিক্ষার্থীদের ড্যাশবোর্ডে এই লিংকগুলো দেখাবে
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="live" className="text-sm">
              <Video className="mr-1 inline h-4 w-4" /> লাইভ ক্লাসের লিংক (Zoom / Meet)
            </Label>
            <Input
              id="live"
              type="url"
              value={live}
              onChange={(e) => setLive(e.target.value)}
              placeholder="https://zoom.us/j/..."
              className="mt-2 h-11 font-mono text-sm"
            />
          </div>
          <div>
            <Label htmlFor="exam" className="text-sm">
              <FileQuestion className="mr-1 inline h-4 w-4" /> পরীক্ষার লিংক (Google Form)
            </Label>
            <Input
              id="exam"
              type="url"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="https://forms.gle/..."
              className="mt-2 h-11 font-mono text-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-5 w-full bg-gradient-to-r from-accent to-success text-accent-foreground sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" /> সেভ করুন
        </Button>

        {links.updatedAt && (
          <p className="mt-3 text-xs text-muted-foreground">
            সর্বশেষ আপডেট: {formatTime(links.updatedAt)}
          </p>
        )}
      </form>

      <PreviewLink label="লাইভ ক্লাস লিংক" url={links.liveUrl} icon={Video} />
      <PreviewLink label="পরীক্ষা লিংক" url={links.examUrl} icon={FileQuestion} />
    </div>
  );
}

function PreviewLink({ label, url, icon: Icon }: { label: string; url: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" /> {label}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex items-center gap-1 break-all text-sm text-primary hover:underline"
        >
          {url} <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">এখনো সেট করা হয়নি।</p>
      )}
    </div>
  );
}

/* ---------- Shared ---------- */
function StatCard({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary" | "warning" | "success" | "accent" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/15 text-success",
    accent: "bg-accent/15 text-accent",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-foreground">{value.toLocaleString("bn-BD")}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <TrendingUp className="h-3 w-3" /> রিয়েল-টাইম আপডেট
      </p>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left font-medium ${className}`}>{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: "pending" | "approved" }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function RowActions({ row }: { row: Enrollment }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {row.status === "pending" && (
        <Button
          size="sm"
          className="bg-success text-success-foreground hover:bg-success/90"
          onClick={() => {
            approveEnrollment(row.id);
            toast.success(`${row.name} এর পেমেন্ট অনুমোদিত হয়েছে`);
          }}
        >
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          if (confirm(`${row.name} এর আবেদন মুছবেন?`)) {
            deleteEnrollment(row.id);
            toast.success("মুছে ফেলা হয়েছে");
          }
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function FacebookCell({ value }: { value: string }) {
  const looksLikeUrl = /^https?:\/\//i.test(value) || value.includes("facebook.com");
  if (looksLikeUrl) {
    const href = value.startsWith("http") ? value : `https://${value}`;
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-flex max-w-[200px] items-center gap-1 truncate text-primary hover:underline">
        <span className="truncate">{value}</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );
  }
  return <span className="block max-w-[200px] truncate text-foreground">{value}</span>;
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`truncate ${mono ? "font-mono" : ""} text-foreground`}>{value}</p>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" });
}