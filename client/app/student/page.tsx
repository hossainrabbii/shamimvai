"use client";

import { useEffect, useState } from "react";
import StudentDashboard from "@/components/Student-dashboard";
import NoticeBoard from "@/components/Student/NoticeBoard";
import { EnrollmentService } from "@/services/enrollment";
import { LinksService } from "@/services/link";
import { NoticeService } from "@/services/notice";
import { Loader2 } from "lucide-react";

export default function StudentPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [links, setLinks] = useState<any>(null);
  const [hasActiveEnrollment, setHasActiveEnrollment] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const checkEnrollmentAndFetchData = async () => {
      try {
        // ১. ব্রাউজারের localStorage থেকে ইউজার ডাটা নেওয়া
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setPageLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const studentId = parsedUser?._id;

        if (studentId) {
          // ২. শুধুমাত্র এই স্টুডেন্টের এনরোলমেন্ট চেক করা
          const enrollRes = await EnrollmentService.getMyEnrollments(studentId);
          
          if (enrollRes?.success && Array.isArray(enrollRes.data)) {
            // চেক করা হচ্ছে কোনো কোর্স 'approved' আছে কিনা
            const isActive = enrollRes.data.some((e: any) => e.status === "approved");
            setHasActiveEnrollment(isActive);

            // ৩. যদি স্টুডেন্ট Approved হয়, তবেই নোটিশ ও লিংক ফেচ হবে (নিরাপত্তার জন্য)
            if (isActive) {
              const [noticeRes, linksRes] = await Promise.all([
                NoticeService.getAllNotices(),
                LinksService.getLatestLinks(),
              ]);

              if (noticeRes?.success) setNotices(noticeRes.data);
              if (linksRes?.success) setLinks(linksRes.data);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    checkEnrollmentAndFetchData();
  }, []);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* 🚀 আপনার ড্যাশবোর্ড আগের মতোই আনটাচড থাকবে */}
      <StudentDashboard />

      {/* 🔒 কন্ডিশন: শুধুমাত্র Approved বা Enrolled ইউজাররাই নোটিশ বোর্ড দেখতে পাবে */}
      {hasActiveEnrollment ? (
        <NoticeBoard notices={notices} links={links} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed p-6 text-center text-amber-700 bg-amber-500/5 border-amber-500/20 dark:text-amber-500">
            <p className="text-sm font-medium">
              🔒 অফিশিয়াল নোটিশ, লাইভ ক্লাস এবং পরীক্ষার লিংকগুলো দেখতে আপনার যেকোনো একটি কোর্স সচল (Approved) থাকতে হবে।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}