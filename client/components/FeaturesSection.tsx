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
import SectionHeader from "./SectionHeader";
import { featuresData } from "@/lib/demoData";
 
  
  function FeaturesSection() {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="যা যা পাবেন"
            title="কোর্সে অন্তর্ভুক্ত সকল সুবিধা"
            subtitle="প্রতিটি ফিচার সাজানো হয়েছে আপনার সফলতাকে সামনে রেখে।"
          />
          
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuresData.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  export default FeaturesSection;