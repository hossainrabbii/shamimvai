"use client";

import { useEffect, useState } from "react";
import { Megaphone, Send, Trash2, CalendarClock, Loader2, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { NoticeService, INotice } from "@/services/notice"; // আপনার সঠিক সার্ভিস পাথ দিন

export default function NoticesPanel() {
  // ডাটাবেজ থেকে আসা নোটিশ লিস্টের স্টেট
  const [notices, setNotices] = useState<INotice[]>([]);
  
  // ইনপুট ফিল্ড স্টেটসমূহ (নতুন নোটিশের জন্য)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  // এডিট বাটন চাপলে মডাল কন্ট্রোল ও ডাটা রাখার স্টেট
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // লোডিং ও অ্যাকশন স্টেটসমূহ
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🚀 ১. ডাটাবেজ থেকে নোটিশ লোড করা (GET)
  const fetchNotices = async () => {
    try {
      const response = await NoticeService.getAllNotices();
      if (response && response.success) {
        setNotices(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("নোটিশ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 🚀 ২. নতুন নোটিশ ডাটাবেজে পাবলিশ করা (POST)
  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return toast.error("শিরোনাম এবং বিস্তারিত বিবরণ দুটিই লিখুন।");
    }

    setSubmitting(true);
    try {
      const response = await NoticeService.createNotice({ title, content });
      
      if (response && response.success) {
        toast.success("নোটিশ প্রকাশিত হয়েছে");
        setTitle("");
        setContent("");
        fetchNotices(); // রিয়েল-টাইম লিস্ট রিফ্রেশ
      } else {
        throw new Error(response.message || "পাবলিশ করতে সমস্যা হয়েছে।");
      }
    } catch (error: any) {
      toast.error(error.message || "সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  }

  // 🚀 ৩. এডিট মোড ওপেন করা
  const openEditModal = (notice: INotice) => {
    setEditingNoticeId(notice._id);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setIsEditModalOpen(true);
  };

  // 🚀 ৪. নোটিশ আপডেট সাবমিট করা (PATCH)
  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNoticeId || !editTitle.trim() || !editContent.trim()) {
      return toast.error("শিরোনাম এবং বিবরণ খালি রাখা যাবে না।");
    }

    setUpdating(true);
    try {
      const response = await NoticeService.updateNotice(editingNoticeId, {
        title: editTitle,
        content: editContent,
      });

      if (response && response.success) {
        toast.success("নোটিশ সফলভাবে আপডেট করা হয়েছে");
        setIsEditModalOpen(false);
        setEditingNoticeId(null);
        fetchNotices(); // UI লিস্ট আপডেট
      } else {
        throw new Error(response.message || "আপডেট করতে সমস্যা হয়েছে।");
      }
    } catch (error: any) {
      toast.error(error.message || "আপডেট করা সম্ভব হয়নি।");
    } finally {
      setUpdating(false);
    }
  };

  // 🚀 ৫. ডাটাবেজ থেকে নোটিশ ডিলিট করা (DELETE)
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await NoticeService.deleteNotice(id);
      if (response && response.success) {
        setNotices(prev => prev.filter(item => item._id !== id));
        toast.success("নোটিশটি মুছে ফেলা হয়েছে");
      } else {
        throw new Error(response.message || "মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch (error: any) {
      toast.error(error.message || "ডিলিট করতে সমস্যা হয়েছে।");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-5 font-bangla relative">
      
      {/* বাম পাশ: নোটিশ ফর্ম */}
      <form onSubmit={handlePublish} className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2 h-fit">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/20 text-warning-foreground">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">নতুন নোটিশ লিখুন</h3>
            <p className="text-xs text-muted-foreground">সকল শিক্ষার্থী দেখতে পাবে</p>
          </div>
        </div>

        <div className="mb-3">
          <Label htmlFor="title" className="text-sm font-medium">নোটিশের শিরোনাম</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="যেমন: পরীক্ষার সময় পরিবর্তন" 
            className="mt-2 h-10" 
          />
        </div>

        <div>
          <Label htmlFor="notice" className="text-sm font-medium">বিস্তারিত বিবরণ</Label>
          <Textarea 
            id="notice" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="যেমন: আজ রাত ৯টায় পরীক্ষা নেওয়া হবে" 
            rows={5} 
            className="mt-2" 
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitting || !title.trim() || !content.trim()} 
          className="mt-4 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold h-10 rounded-lg transition-all"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Publish Notice
        </Button>
      </form>

      {/* ডান পাশ: প্রকাশিত নোটিশের রিয়েল লিস্ট */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
        <h3 className="mb-4 font-bold text-foreground">প্রকাশিত নোটিশসমূহ ({notices.length})</h3>
        
        {loading ? (
          <div className="flex py-20 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
            এখনো কোনো নোটিশ প্রকাশ করা হয়নি।
          </div>
        ) : (
          <ul className="space-y-3">
            {notices.map((n, idx) => (
              <li 
                key={n._id} 
                className={`rounded-xl border p-4 transition-all ${
                  idx === 0 ? "border-warning/40 bg-warning/10" : "border-border bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">{n.title}</h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{n.content}</p>
                  </div>
                  
                  {/* অ্যাকশন বাটনসমূহ (Edit এবং Delete) */}
                  <div className="shrink-0 flex items-center gap-1">
                    {/* এডিট বাটন */}
                    <button 
                      onClick={() => openEditModal(n)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    {/* ডিলিট বাটন */}
                    <button 
                      disabled={deletingId === n._id}
                      onClick={() => {
                        if (confirm("আপনি কি এই নোটিশটি চিরতরে মুছে ফেলতে চান?")) {
                          handleDelete(n._id);
                        }
                      }} 
                      className="rounded-md p-1.5 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      {deletingId === n._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground border-t border-border/20 pt-2 w-fit">
                  <CalendarClock className="h-3 w-3" /> 
                  {n.createdAt ? new Date(n.createdAt).toLocaleString("bn-BD", { dateStyle: "long", timeStyle: "short" }) : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🛠️ নোটিশ এডিট করার কাস্টম পপআপ মডাল (Overlay) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg relative animate-in fade-in zoom-in duration-200">
            
            {/* মডাল ক্লোজ বাটন */}
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-md p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Edit2 className="h-4 w-4 text-primary" /> নোটিশ সংশোধন করুন
            </h3>

            <form onSubmit={handleUpdateNotice} className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium">নোটিশের শিরোনাম</Label>
                <Input 
                  id="edit-title" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="mt-2 h-10"
                />
              </div>

              <div>
                <Label htmlFor="edit-content" className="text-sm font-medium">বিস্তারিত বিবরণ</Label>
                <Textarea 
                  id="edit-content" 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)} 
                  rows={5} 
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg h-10"
                >
                  বাতিল করুন
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating || !editTitle.trim() || !editContent.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 rounded-lg px-5"
                >
                  {updating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "আপডেট করুন"
                  )}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}