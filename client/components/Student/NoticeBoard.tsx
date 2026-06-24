import { Megaphone, Clock, Video, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// টাইপ ডেফিনিশন
interface INotice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ILinks {
  _id?: string;
  liveUrl: string;
  examUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NoticeBoardProps {
  notices: INotice[];
  links: ILinks | null;
}

export default function NoticeBoard({ notices, links }: NoticeBoardProps) {
  // সময় ও তারিখ সুন্দরভাবে সাজানোর ফাংশন
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
      {/* 🚀 ১. নোটিশ বোর্ড সেকশন */}
      {notices && notices.length > 0 && (
        <div className="rounded-3xl border border-amber-200/60 p-6 shadow-sm dark:border-amber-900/30 dark:bg-amber-950/10">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold mb-5">
            <Megaphone className="h-6 w-6 animate-pulse" />
            <h2 className="text-xl">গুরুত্বপূর্ণ নোটিশ</h2>
          </div>

          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice._id} className="rounded-2xl p-5 border border-border/80 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  {/* 📌 টাইটেল (Bold) */}
                  <h3 className="font-bold text-lg text-foreground leading-snug">
                    {notice.title}
                  </h3>
                  
                  {/* 📌 সময় (Time) */}
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-muted/50 px-2.5 py-1 rounded-md whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTime(notice.createdAt)}
                  </span>
                </div>
                
                {/* 📌 কনটেন্ট */}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 ২. লাইভ ক্লাস এবং পরীক্ষার লিংক সেকশন */}
      {links && (links.liveUrl || links.examUrl) && (
        <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">ক্লাস ও পরীক্ষা লিংক</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* লাইভ ক্লাস */}
            <div className="rounded-2xl border p-4 bg-muted/20 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                  <Video className="h-5 w-5 text-emerald-600" /> লাইভ ক্লাস (Live Class)
                </h4>
              </div>
              {links.liveUrl ? (
                <Link href={links.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2">
                    <ExternalLink className="h-4 w-4" /> ক্লাসে যোগ দিন
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground rounded-xl">লিংক দেওয়া হয়নি</Button>
              )}
            </div>

            {/* পরীক্ষা (Exam) */}
            <div className="rounded-2xl border p-4 bg-muted/20 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-blue-600" /> আজকের পরীক্ষা (Exam)
                </h4>
              </div>
              {links.examUrl ? (
                <Link href={links.examUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl gap-2">
                    <ExternalLink className="h-4 w-4" /> পরীক্ষায় অংশ নিন
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground rounded-xl">লিংক দেওয়া হয়নি</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}