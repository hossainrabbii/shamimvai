"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; 
import {
  Infinity as InfinityIcon,
  BookOpen,
  FileText,
  Languages,
  PlayCircle,
  CalendarCheck,
  HandHeart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  // FacebookIcon,
  Phone,
  User as UserIcon,
  Hash,
  Loader2,
  X,
  PartyPopper,
  Target,
  GraduationCap,
  Calculator,
  Lock,
  LogIn,
  CheckCircle2,
  TrendingDown,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import CourseBadgeStrip from "@/components/CourseBadgeStrip";
import FeaturesSection from "@/components/FeaturesSection";
import AudienceSection from "@/components/AudienceSection";
import Hero from "@/components/Hero";
import NavBar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";

/* ==========================================================================
   SERVER & DB CODE REQUIRED (এই অংশগুলো ডাটাবেজ/এপিআই এর সাথে কানেক্ট করতে হবে)
   ========================================================================== */
// import { addEnrollment } from "@/lib/enrollments"; 

const BKASH_NUMBER = "01XXX-XXX199";
const NAGAD_NUMBER = "01XXX-XXX199";
const FB_GROUP_URL = "https://facebook.com/groups/shamimvai";


export default function LandingPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-bangla">
      <NavBar onEnroll={() => setCheckoutOpen(true)} />
      <Hero onEnroll={() => setCheckoutOpen(true)} />
      <CourseBadgeStrip />
      <FeaturesSection />
      <AudienceSection />
      <PricingSection onEnroll={() => setCheckoutOpen(true)} />
      <Footer />
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}

/* ===================== CHECKOUT MODAL ===================== */

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    facebook: "",
    senderNumber: "",
    trxId: "",
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !success && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, success]);

  function validateStep1() {
    if (data.name.trim().length < 2) return "সঠিক নাম লিখুন";
    const id = data.email.trim();
    // const isPhone = /^01[0-9]{9}$/.test(id);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    if (!isEmail) return "সঠিক ইমেইল দিন";
    if (data.password.length < 4) return "কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন";
    return null;
  }
  
  function validateStep3() {
    if (!/^01[0-9]{9}$/.test(data.senderNumber.trim())) return "সঠিক sender নম্বর দিন";
    if (data.trxId.trim().length < 6) return "সঠিক TrxID দিন";
    return null;
  }

  function next() {
    if (step === 1) {
      const err = validateStep1();
      if (err) return toast.error(err);
    }
    setStep((s) => Math.min(3, s + 1));
  }

  async function submit() {
    const err = validateStep3();
    if (err) return toast.error(err);
    setSubmitting(true);
    console.log(data);
    /* ==========================================================================
       SERVER & DB CODE REQUIRED (নিচের অংশটি এপিআই বা ডাটাবেজ পুশ দিয়ে রিপ্লেস হবে)
       ========================================================================== */
    await new Promise((r) => setTimeout(r, 800)); // মক টাইমআউট (সার্ভার লোডিং সিমুলেশন)
    
    // ডাটাবেজে স্টোর করার লজিক এখানে যুক্ত করতে হবে। যেমন:
    // const res = await fetch('/api/enroll', { method: 'POST', body: JSON.stringify(data) });
    // if(res.ok) { ... }
    
    console.log("Saving enrollment to Database:", {
      name: data.name.trim(),
      phone: data.email.trim(),
      password: data.password,
      facebook: data.facebook.trim(),
      senderNumber: data.senderNumber.trim(),
      trxId: data.trxId.trim(),
      amount: 150,
    });
    /* ========================================================================== */

    setSubmitting(false);
    setSuccess(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-background shadow-elegant sm:rounded-3xl">
        {!success && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted"
            aria-label="বন্ধ করুন"
          >
            <X className="h-4 w-4" />
          </button>
        )}
<RegistrationForm />

      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["তথ্য", "পেমেন্ট", "নিশ্চিতকরণ"];
  return (
    <div className="mt-6 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${
                done
                  ? "bg-success text-success-foreground"
                  : active
                  ? "bg-gradient-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            <span className={`hidden text-sm font-medium sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${done ? "bg-success" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

type Data = { name: string; phone: string; password: string; facebook: string; senderNumber: string; trxId: string };

// function StepInfo({ data, setData }: { data: Data; setData: (d: Data) => void }) {
//   return (
//     <div className="mt-6 space-y-4">
//       <Field icon={UserIcon} label="পূর্ণ নাম">
//         <Input
//           value={data.name}
//           onChange={(e) => setData({ ...data, name: e.target.value })}
//           placeholder="আপনার পূর্ণ নাম লিখুন"
//           maxLength={80}
//           className="h-12 pl-10"
//         />
//       </Field>
//       <Field icon={Mail} label="ইমেইল">
//         <Input
//           value={data.email}
//           onChange={(e) => setData({ ...data, phone: e.target.value.trim() })}
//           placeholder="you@example.com"
//           maxLength={120}
//           className="h-12 pl-10"
//         />
//       </Field>
//       <Field icon={Lock} label="পাসওয়ার্ড সেট করুন">
//         <Input
//           type="password"
//           value={data.password}
//           onChange={(e) => setData({ ...data, password: e.target.value })}
//           placeholder="লগইনের জন্য একটি পাসওয়ার্ড দিন"
//           maxLength={64}
//           className="h-12 pl-10"
//         />
//       </Field>
//       <Field icon='' label="Facebook প্রোফাইল নাম/লিংক (ঐচ্ছিক / Optional)">
//         <Input
//           value={data.facebook}
//           onChange={(e) => setData({ ...data, facebook: e.target.value })}
//           placeholder="facebook.com/your.profile (optional)"
//           maxLength={200}
//           className="h-12 pl-10"
//         />
//       </Field>
//     </div>
//   );
// }

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div>
     <Label className="mb-1.5 block text-sm font-medium text-foreground">{label}</Label>
<div className="relative">
  {/* শুধু Icon এর ভ্যালু থাকলেই সেটি রেন্ডার হবে */}
  {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
  
  {/* যদি আইকন থাকে তবে ইনপুটে প্যাডিং লেফট (pl-10) ডাইনামিকালি দিতে পারেন */}
  {children}
</div>
    </div>
  );
}

function StepPayment() {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
        <p className="font-semibold">নিম্নলিখিত যেকোনো একটি নম্বরে <span className="text-primary">Send Money</span> করুন।</p>
        <p className="mt-1 text-muted-foreground">পরিমাণ: <span className="font-bold text-foreground">১৫০ টাকা</span></p>
      </div>

      <PaymentCard brand="bKash" color="bg-[#E2136E]" number={BKASH_NUMBER} />
      <PaymentCard brand="Nagad" color="bg-[#EB5B1D]" number={NAGAD_NUMBER} />

      <div className="rounded-xl bg-secondary p-4 text-xs text-muted-foreground">
        ⚠️ <span className="font-medium text-foreground">নোট:</span> অবশ্যই <span className="font-semibold">Send Money</span> অপশন ব্যবহার করুন। Cash Out / Payment নয়। সফল ট্রানজেকশনের পর TrxID টি পরের ধাপে দিন।
      </div>
    </div>
  );
}

function PaymentCard({ brand, color, number }: { brand: string; color: string; number: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white ${color}`}>
        {brand[0]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{brand} (Personal)</p>
        <p className="truncate font-mono text-lg font-bold tracking-wide text-foreground">{number}</p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(number);
          setCopied(true);
          toast.success(`${brand} নম্বর কপি হয়েছে`);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-muted"
        aria-label="Copy"
      >
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function StepConfirm({ data, setData }: { data: Data; setData: (d: Data) => void }) {
  return (
    <div className="mt-6 space-y-4">
      <Field icon={Phone} label="যে নম্বর থেকে Send Money করেছেন">
        <Input
          value={data.senderNumber}
          onChange={(e) => setData({ ...data, senderNumber: e.target.value.replace(/\D/g, "") })}
          placeholder="01XXXXXXXXX"
          maxLength={11}
          inputMode="numeric"
          className="h-12 pl-10"
        />
      </Field>
      <Field icon={Hash} label="Transaction ID (TrxID)">
        <Input
          value={data.trxId}
          onChange={(e) => setData({ ...data, trxId: e.target.value.toUpperCase() })}
          placeholder="যেমন: 9HG2K1L3PQ"
          maxLength={20}
          className="h-12 pl-10 font-mono tracking-wider"
        />
      </Field>
      <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <p className="font-semibold text-foreground">সংক্ষিপ্ত তথ্য</p>
        <div className="mt-2 grid gap-1 text-muted-foreground">
          <div><span className="text-foreground">নাম:</span> {data.name || "—"}</div>
          <div><span className="text-foreground">মোবাইল/ইমেইল:</span> {data.phone || "—"}</div>
          <div><span className="text-foreground">পরিমাণ:</span> ১৫০ টাকা</div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative overflow-hidden p-8 text-center sm:p-12">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-success/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-accent text-accent-foreground shadow-glow animate-pulse-ring">
        <PartyPopper className="h-9 w-9" />
      </div>
      <h3 className="relative mt-6 text-2xl font-bold text-foreground sm:text-3xl">
        আপনার পেমেন্ট রিকুয়েস্টটি জমা হয়েছে! 🎉
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-muted-foreground">
        ভেরিফিকেশনের জন্য সর্বোচ্চ <span className="font-semibold text-foreground">৩০ মিনিট</span> সময় লাগতে পারে। নিচের বাটনে ক্লিক করে আমাদের সিক্রেট ফেসবুক গ্রুপে জয়েন রিকুয়েস্ট পাঠান এবং ফেসবুকের প্রশ্নের ঘরে আপনার <span className="font-semibold text-foreground">ফোন নম্বরটি</span> লিখুন।
      </p>

      <a href={FB_GROUP_URL} target="_blank" rel="noreferrer" className="relative mt-7 inline-flex">
        <Button size="lg" className="h-14 rounded-xl bg-[#1877F2] px-8 text-base font-bold text-white shadow-glow hover:opacity-95">
          {/* <FacebookIcon className="mr-2 h-5 w-5" />  */}
          
          ফেসবুক গ্রুপে জয়েন করুন
        </Button>
      </a>

      <button onClick={onClose} className="relative mt-5 block w-full text-sm text-muted-foreground hover:text-foreground">
        হোমপেজে ফিরে যান
      </button>
    </div>
  );
}