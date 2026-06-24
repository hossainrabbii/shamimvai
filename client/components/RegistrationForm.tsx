"use client";

import { useState } from "react";
import { User as UserIcon, Mail, Lock, Loader2, ArrowRight, } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserService } from "@/services/user";

// আপনার প্রোভাইড করা Field কম্পোনেন্টটি যদি আলাদা করা না থাকে
function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
    </div>
  );
}

export default function RegistrationForm() {
  const router = useRouter(); 

  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    facebook: "",
  });

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    // বেসিক ক্লায়েন্ট-সাইড ভ্যালিডেশন
    if (!data.name.trim() || !data.email.trim() || !data.password) {
      return toast.error("অনুগ্রহ করে সবকটি আবশ্যিক ফিল্ড পূরণ করুন");
    }

    setSubmitting(true);

    try {
      
      const res = await UserService.registerUser(data);
      if(!res?.success){
        toast.error(res?.message || "কোথাও কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        return
      }
      
      toast.success(res?.message || "রেজিস্ট্রেশন সফল হয়েছে!");
      router.push("/student");
     
    } catch (error) {
      toast.error("কোথাও কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4">
        <h3 className="text-2xl font-bold text-foreground">রেজিস্ট্রেশন সম্পন্ন করুন</h3>
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* নাম ফিল্ড */}
      <Field icon={UserIcon} label="পূর্ণ নাম">
        <Input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="আপনার পূর্ণ নাম লিখুন"
          maxLength={80}
          required
          disabled={submitting}
          className="h-12 pl-10"
        />
      </Field>

      {/* ইমেইল ফিল্ড */}
      <Field icon={Mail} label="ইমেইল">
        <Input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value.trim() })} // এখানে bug ফিক্স করা হয়েছে (phone থেকে email করা হয়েছে)
          placeholder="you@example.com"
          maxLength={120}
          required
          disabled={submitting}
          className="h-12 pl-10"
        />
      </Field>

      {/* পাসওয়ার্ড ফিল্ড */}
      <Field icon={Lock} label="পাসওয়ার্ড সেট করুন">
        <Input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="লগইনের জন্য একটি পাসওয়ার্ড দিন"
          maxLength={64}
          required
          disabled={submitting}
          className="h-12 pl-10"
        />
      </Field>

      {/* ফেসবুক লিংক ফিল্ড */}
      <Field icon={""} label="Facebook প্রোফাইল নাম/লিংক (ঐচ্ছিক / Optional)">
      
        <Input
          value={data.facebook}
          onChange={(e) => setData({ ...data, facebook: e.target.value })}
          placeholder="facebook.com/your.profile (optional)"
          maxLength={200}
          disabled={submitting}
          className="h-12 pl-10"
        />
      </Field>

      {/* সাবমিট বাটন */}
      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full bg-gradient-primary font-bold shadow-md hover:opacity-95 disabled:opacity-80"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> সাবমিট হচ্ছে...
          </>
        ) : (
          <>
            রেজিস্ট্রেশন করুন <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
    <div className="text-center">
    <Link href="/student-login" className="hover:text-foreground"> ইতিমধ্যে নিবন্ধিত? <span className="text-gradient-accent"> লগইন করুন</span></Link>
    </div>
    </div>
  );
}