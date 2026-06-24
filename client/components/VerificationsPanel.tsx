"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle2, Clock, Trash2, XCircle, Loader2 } from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { EnrollmentService } from "@/services/enrollment"; // আপনার সার্ভিস ফাইলের প্রোপার পাথ দিন
import { toast } from "sonner"; // অথবা আপনার প্রজেক্টের টোস্ট লাইব্রেরি
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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

interface EnrollmentdProps {
  enrollments: {
    data: Enrollment[];
  } | any;
}

export default function VerificationsPanel({ enrollments }: EnrollmentdProps) {
  // ব্যাকএন্ড ডাটা থেকে সেফলি অ্যারে এক্সট্রাক্ট করা (enrollments.data)
  const rawData = enrollments?.data || (Array.isArray(enrollments) ? enrollments : []);

  const {
    query,
    setQuery,
    filter,
    setFilter,
    filtered,
    handleApprove, 
    handleDelete   
  } = useAdminDashboard(rawData);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onApproveClick = async (id: string) => {
    setLoadingId(id);
    try {
      // সার্ভিস কল: PATCH মেথড দিয়ে status: "approved" পাঠানো হচ্ছে
      const result = await EnrollmentService.updateEnrollmentStatus(id, "approved");

      if (result && (result.success !== false)) {
        handleApprove(id); // লোকাল UI স্টেট সিঙ্ক
        toast.success("এনরোলমেন্ট সফলভাবে অনুমোদিত হয়েছে!");
      } else {
        throw new Error(result?.message || "স্ট্যাটাস আপডেট করা সম্ভব হয়নি।");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "ডাটাবেজ আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setLoadingId(null);
    }
  };

  // 🚀 ২. আপনার সার্ভিস ব্যবহার করে ডাটাবেজ থেকে রিকোয়েস্ট Delete করা
  const onDeleteClick = async (id: string) => {
    setLoadingId(id);
    try {
      // সার্ভিস কল: DELETE মেথড
      const result = await EnrollmentService.deleteEnrollment(id);

      if (result && (result.success !== false)) {
        handleDelete(id); // লোকাল UI স্টেট থেকে রিমুভ
        toast.success("এনরোলমেন্ট রিকোয়েস্টটি মুছে ফেলা হয়েছে।");
      } else {
        throw new Error(result?.message || "মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "মুছে ফেলতে সমস্যা হয়েছে।");
    } finally {
      setLoadingId(null);
    }
  };

  const safeData = Array.isArray(filtered) ? filtered : [];

  return (
    <>
      <div className="rounded-2xl border border-border bg-card shadow-sm font-bangla">
        {/* সার্চ এবং ফিল্টার এরিয়া */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="কোর্সের নাম, শিক্ষার্থীর নাম বা TrxID..."
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
                  filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "সব" : f === "pending" ? "পেন্ডিং" : "অনুমোদিত"}
              </button>
            ))}
          </div>
        </div>

        {/* টেবিল এরিয়া */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">কোর্সের নাম</th>
                <th className="px-4 py-3 text-left font-medium">শিক্ষার্থীর নাম</th>
                <th className="px-4 py-3 text-left font-medium">暗শিক্ষার্থীর ফোন</th>
                <th className="px-4 py-3 text-left font-medium">পেমেন্ট নম্বর (Sender)</th>
                <th className="px-4 py-3 text-left font-medium">TrxID</th>
                <th className="px-4 py-3 text-left font-medium">আবেদনের সময়</th>
                <th className="px-4 py-3 text-left font-medium">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-right font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {safeData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground font-medium">
                    কোনো এনরোলমেন্ট রিকোয়েস্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                safeData.map((e) => (
                  <tr key={e._id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-4 py-3 align-middle font-semibold text-foreground">
                      {e.courseId?.name ? e.courseId.name : <span className="text-destructive text-xs font-normal">কোর্সটি মুছে ফেলা হয়েছে</span>}
                    </td>
                    
                    <td className="px-4 py-3 align-middle font-medium text-foreground">
                      {e.studentId?.name ? e.studentId.name : <span className="text-muted-foreground text-xs font-normal">অজানা ইউজার</span>}
                    </td>

                    <td className="px-4 py-3 align-middle font-mono text-xs text-muted-foreground">
                      {e.studentId?.phone || "N/A"}
                    </td>
                    
                    <td className="px-4 py-3 align-middle font-mono text-xs text-foreground">
                      {e.paidNumber || "N/A"}
                    </td>
                    
                    <td className="px-4 py-3 align-middle font-mono text-xs font-bold text-primary tracking-wide">
                      {e.transactionId || "N/A"}
                    </td>
                    
                    <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                      {e.createdAt ? new Date(e.createdAt).toLocaleString("bn-BD", { dateStyle: "short", timeStyle: "short" }) : "N/A"}
                    </td>
                    
                    <td className="px-4 py-3 align-middle">
                      {e.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      ) : e.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-semibold text-destructive">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 align-middle text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {e.status === "pending" && (
                          <Button
                            size="sm" 
                            disabled={loadingId === e._id}
                            className="bg-success text-success-foreground hover:bg-success/90 h-8 text-xs px-2.5 rounded-lg transition-all" 
                            onClick={() => onApproveClick(e._id)}
                          >
                            {loadingId === e._id ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            )}
                            Approve
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          disabled={loadingId === e._id}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 rounded-lg transition-colors" 
                          onClick={() => { 
                            if (confirm("আপনি কি এই এনরোলমেন্ট রিকোয়েস্টটি চিরতরে মুছে ফেলতে চান?")) {
                              onDeleteClick(e._id);
                            } 
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}