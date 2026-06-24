"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, BookOpen, CreditCard, LogOut, CheckCircle, Wallet, Loader2, Phone, KeyRound, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseService } from "@/services/course";
import { EnrollmentService } from "@/services/enrollment";

interface PaymentMethod {
  name: string;
  number: string;
}

interface Course {
  _id: string;
  name: string;
  length: string;
  price: number;
  discountPrice: number | null;
  description: string;
  paymentMethods: PaymentMethod[];
}

interface Enrollment {
  _id: string;
  courseId: {
    _id: string;
    name: string;
  };
  status: "pending" | "approved" | "rejected";
}

interface IStudentState {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function StudentDashboard() {
  const router = useRouter();
  
  const [student, setStudent] = useState<IStudentState | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  // পেমেন্ট মডাল স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paidNumber, setPaidNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      toast.error("অনুগ্রহ করে আগে লগইন করুন!");
      localStorage.clear();
      router.push("/student-login"); 
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setStudent(parsedUser);
      
      // লাইভ ডাটা লোড করা
      fetchDashboardData(parsedUser._id);
    } catch (error) {
      console.error("Data parsing error:", error);
      router.push("/student-login");
    }
  }, [router]);

  const fetchDashboardData = async (studentId: string) => {
    setLoading(true);
    try {
      // ১. ডাটাবেজ থেকে সব লাইভ কোর্স আনা
      const courseRes = await CourseService.getAllCourses();
      if (courseRes?.success) setCourses(courseRes.data);

      // ২. স্টুডেন্টের নিজের বর্তমান এনরোলমেন্ট হিস্ট্রি আনা
      const enrollRes = await EnrollmentService.getMyEnrollments(studentId);
      if (enrollRes?.success) setMyEnrollments(enrollRes.data);
    } catch (err) {
      toast.error("ডাটা লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    toast.success("সফলভাবে লগআউট হয়েছে!");
    router.push("/student-login");
  };

  const openEnrollModal = (course: Course) => {
    setSelectedCourse(course);
    setPaidNumber("");
    setTransactionId("");
    setIsModalOpen(true);
  };

  // পেমেন্ট রিকোয়েস্ট সাবমিট করা (Enrollment Create)
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !selectedCourse) return;

    if (!paidNumber || !transactionId) {
      toast.error("অনুগ্রহ করে সবগুলো ফিল্ড পূরণ করুন");
      return;
    }

    // ফোন নম্বর ভ্যালিডেশন চেক (১১ ডিজিট ও ০১ দিয়ে শুরু)
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(paidNumber.trim())) {
      toast.error("সঠিক পেমেন্ট নম্বর দিন (অবশ্যই 01 দিয়ে শুরু এবং 11 ডিজিট হতে হবে)");
      return;
    }

    setSubmitting(true);
    const payload = {
      studentId: student._id,
      courseId: selectedCourse._id,
      paidNumber: paidNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
    };

    const res = await EnrollmentService.enrollInCourse(payload);
    if (res?.success) {
      toast.success(res.message || "পেমেন্ট সফলভাবে সাবমিট হয়েছে!");
      setIsModalOpen(false);
      fetchDashboardData(student._id); // ড্যাশবোর্ড ডাটা রিফ্রেশ
    } else {
      toast.error(res?.message || "সাবমিশন ব্যর্থ হয়েছে");
    }
    setSubmitting(false);
  };

  // একটি কোর্সের এনরোলমেন্ট স্ট্যাটাস চেক করার হেল্পার ফাংশন
  const getEnrollmentStatus = (courseId: string) => {
    const enrollment = myEnrollments.find((e) => e.courseId && (e.courseId._id === courseId || (e.courseId as any) === courseId));
    return enrollment ? enrollment.status : null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      {/* নেভিগেশন বার */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">Student<span className="text-primary">Portal</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" /> লগআউট
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            স্বাগতম, <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent capitalize">{student?.name}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">আপনার প্রয়োজনীয় কোর্স নির্বাচন করুন এবং অগ্রগতি ট্র্যাক করুন।</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* প্রোফাইল কার্ড */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground mb-4">প্রোফাইল ইনফরমেশন</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                  <User className="h-4 w-4 text-primary" />
                  <div className="overflow-hidden"><span className="block text-[10px] text-muted-foreground">নাম</span><span className="text-xs font-semibold block truncate capitalize">{student?.name}</span></div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div className="overflow-hidden"><span className="block text-[10px] text-muted-foreground">ইমেইল</span><span className="text-xs font-semibold block truncate">{student?.email}</span></div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <div><span className="block text-[10px] text-muted-foreground">টাইপ</span><span className="inline-block text-[11px] font-bold text-primary capitalize">{student?.role}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* লাইভ কোর্স তালিকা সেকশন */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xl font-bold text-foreground">উপলব্ধ কোর্স সমূহ (Live Courses)</h3>
            
            {courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground bg-background">এই মুহূর্তে কোনো কোর্স এভেইলেবল নেই।</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {courses.map((course) => {
                  const status = getEnrollmentStatus(course._id);
                  return (
                    <div key={course._id} className="rounded-2xl border border-border bg-background p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-lg text-foreground leading-snug">{course.name}</h4>
                          
                          {/* ডাইনামিক স্ট্যাটাস ব্যাজ */}
                          {status === "pending" && <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">Pending Approval</span>}
                          {status === "approved" && <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Enrolled & Active</span>}
                          {status === "rejected" && <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10">Rejected</span>}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{course.description}</p>
                        
                        <div className="mt-4 space-y-2 border-t pt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> মেয়াদ: <strong>{course.length}</strong></div>
                          <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-success" /> কোর্স ফি:{" "}
                            {course.discountPrice ? (
                              <>
                                <span className="line-through text-destructive mr-1">৳{course.price}</span>
                                <strong className="text-sm text-foreground">৳{course.discountPrice}</strong>
                              </>
                            ) : (
                              <strong className="text-sm text-foreground">৳{course.price}</strong>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t">
                        {status === "approved" ? (
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 rounded-xl">
                            <CheckCircle className="h-4 w-4" /> মডিউল আনলকড (Enter Class)
                          </Button>
                        ) : status === "pending" ? (
                          <Button disabled className="w-full bg-amber-500/20 text-amber-700 font-medium rounded-xl">
                            পেমেন্ট যাচাই করা হচ্ছে...
                          </Button>
                        ) : (
                          <Button onClick={() => openEnrollModal(course)} className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold gap-1 rounded-xl shadow-sm">
                            <CreditCard className="h-4 w-4" /> Enroll Now (কোর্সটি কিনুন)
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 🚀 এনরোল ও পেমেন্ট সাবমিশন মডাল */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg my-8">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2 border-b pb-3 mb-4">
              <Wallet className="h-5 w-5 text-primary" /> পেমেন্ট বিবরণী
            </h3>

            <div className="space-y-3 bg-muted/40 p-4 rounded-xl border mb-4 text-sm">
              <div><span className="text-xs text-muted-foreground block">নির্বাচিত কোর্স:</span><span className="font-bold text-foreground">{selectedCourse.name}</span></div>
              <div>
                <span className="text-xs text-muted-foreground block">মোট প্রদেয় ফি:</span>
                <span className="text-xl font-extrabold text-primary">
                  ৳{selectedCourse.discountPrice ? selectedCourse.discountPrice : selectedCourse.price}/-
                </span>
              </div>
            </div>

            {/* পেমেন্ট অ্যাকাউন্ট নম্বর গাইড */}
            <div className="mb-4">
              <Label className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5 block">👇 নিচে দেওয়া নম্বরে টাকা পাঠিয়ে ফরমটি পূরণ করুন:</Label>
              <div className="space-y-1.5">
                {selectedCourse.paymentMethods && selectedCourse.paymentMethods.length > 0 ? (
                  selectedCourse.paymentMethods.map((pm, idx) => (
                    <div key={idx} className="flex items-center justify-between font-mono bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/60 text-xs">
                      <span className="font-bold text-foreground">{pm.name}</span>
                      <span className="font-semibold text-primary">{pm.number}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-destructive">কোনো অফিশিয়াল পেমেন্ট নম্বর পাওয়া যায়নি। এডমিনের সাথে যোগাযোগ করুন।</p>
                )}
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold flex items-center gap-1"><Phone className="h-3 w-3" /> যে নম্বর থেকে টাকা পাঠিয়েছেন (Paid Number) *</Label>
                <Input type="text" maxLength={11} value={paidNumber} onChange={(e) => setPaidNumber(e.target.value)} placeholder="যেমন: 01XXXXXXXXX" className="mt-1 font-mono" />
              </div>

              <div>
                <Label className="text-xs font-semibold flex items-center gap-1"><KeyRound className="h-3 w-3" /> ট্রানজেকশন আইডি (Transaction ID / TrxID) *</Label>
                <Input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="যেমন: 8N73X9WLM" className="mt-1 font-mono uppercase" />
              </div>

              <div className="flex justify-end gap-2 border-t pt-4 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={submitting}>বাতিল</Button>
                <Button type="submit" disabled={submitting} className="bg-success text-success-foreground font-bold flex items-center gap-1">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "পেমেন্ট নিশ্চিত করুন"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}