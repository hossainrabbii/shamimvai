import {
    Infinity as InfinityIcon,
    PlayCircle,
    CalendarCheck,
    HandHeart,
    ShieldCheck,
   
    User as UserIcon,
  } from "lucide-react";
function CourseBadgeStrip() {
    const items = [
      { icon: CalendarCheck, label: "মেয়াদ", value: "৩ মাস" },
      { icon: PlayCircle, label: "স্ট্যাটাস", value: "ক্লাস চলমান" },
      { icon: ShieldCheck, label: "অ্যাক্সেস", value: "লাইফটাইম" },
      { icon: HandHeart, label: "সাপোর্ট", value: "ব্যক্তিগত" },
    ];
    return (
      <section className="border-y border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-px overflow-hidden bg-border px-0 sm:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="flex items-center gap-3 bg-card px-5 py-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <i.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{i.label}</p>
                <p className="truncate font-semibold text-foreground">{i.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  export default CourseBadgeStrip;