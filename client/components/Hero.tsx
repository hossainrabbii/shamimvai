import {
    Infinity as InfinityIcon,
  
    Sparkles,
    ArrowRight,
   
    User as UserIcon,
   
    CheckCircle2,
    TrendingDown,
  
  } from "lucide-react";
import { Button } from "./ui/button";
import { featuresData } from "@/lib/demoData";
function Hero({ onEnroll }: { onEnroll: () => void }) {
    return (
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 90px 90px",
        }} />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-primary-glow/30 blur-3xl animate-float" />
  
        <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-warning" />
              <span>ক্লাস চলমান · ৩ মাসের কোর্স</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              ১১ থেকে ২০তম গ্রেডের <br />
              <span className="bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
                সরকারি চাকরি প্রস্তুতি
              </span>{" "}
              কোর্স
            </h1>
            <p className="mt-4 text-lg text-white/80 sm:text-xl">
              Shamim Vai এর তত্ত্বাবধানে — বুক গাইডলাইন, জব সলিউশন, ভোকাবুলারি রুটিন ও বিগত প্রশ্নের সমাধান একই কোর্সে।
            </p>
  
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                onClick={onEnroll}
                className="h-14 rounded-xl bg-warning px-8 text-base font-bold text-warning-foreground shadow-glow hover:opacity-95 animate-pulse-ring"
              >
                ভর্তি হোন — মাত্র ১৫০৳ <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-baseline gap-2 text-white/90">
                <span className="text-base text-white/60 line-through">১৫০০৳</span>
                <span className="rounded-md bg-destructive px-2 py-0.5 text-sm font-bold">৯০% ছাড়</span>
              </div>
            </div>
  
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> লাইফটাইম অ্যাক্সেস</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> ব্যক্তিগত সহযোগিতা</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> সিক্রেট গ্রুপ অ্যাক্সেস</div>
            </div>
          </div>
  
          <div className="relative">
            <div className="absolute inset-0 -rotate-3 rounded-3xl bg-warning/30 blur-2xl" />
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-elegant">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">কোর্স ফি</p>
                  <p className="mt-1 text-3xl font-bold">১৫০ ৳ <span className="text-base font-normal text-white/60 line-through">১৫০০৳</span></p>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-warning text-warning-foreground shadow-md">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {featuresData.slice(0, 5).map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/30 text-accent-foreground">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <span className="text-white/90">{f.title}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={onEnroll} className="mt-6 w-full bg-gradient-accent text-accent-foreground shadow-md hover:opacity-95">
                এখনই ভর্তি হোন
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }


  export default Hero