import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

function PricingSection({ onEnroll }: { onEnroll: () => void }) {
    return (
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <div className="bg-gradient-hero p-8 text-center text-primary-foreground">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-warning/90 px-4 py-1 text-sm font-bold text-warning-foreground">
                <Sparkles className="h-4 w-4" /> সীমিত সময়ের অফার
              </div>
              <h3 className="text-2xl font-bold sm:text-3xl">৯০% ছাড়ে মাত্র ১৫০ টাকা!</h3>
              <p className="mt-2 text-white/80">আজই ভর্তি হয়ে আপনার সরকারি চাকরির স্বপ্ন বাস্তবায়ন শুরু করুন।</p>
            </div>
            <div className="p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-muted-foreground">নিয়মিত ফি</p>
                <p className="text-xl text-muted-foreground line-through">১৫০০ টাকা</p>
                <p className="mt-2 text-5xl font-bold text-foreground">
                  ১৫০<span className="ml-1 text-2xl text-muted-foreground">টাকা</span>
                </p>
                <span className="mt-2 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
                  সাশ্রয় ১৩৫০ টাকা
                </span>
              </div>
              <Button
                onClick={onEnroll}
                size="lg"
                className="mt-8 h-14 w-full rounded-xl bg-gradient-primary text-base font-bold shadow-glow hover:opacity-95"
              >
                এখনই ভর্তি হোন <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                ভর্তির পরপর সিক্রেট ফেসবুক গ্রুপে অ্যাক্সেস পেয়ে যাবেন।
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  

  export default PricingSection