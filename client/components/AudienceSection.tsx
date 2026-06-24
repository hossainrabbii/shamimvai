import { audienceData } from "@/lib/demoData";
import SectionHeader from "./SectionHeader";

function AudienceSection() {
    return (
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="যাদের জন্য কোর্স"
            title="যারা এই কোর্সে ভর্তি হবেন"
            subtitle="আপনি যদি এই দলের একজন হন — এই কোর্সটি আপনার জন্যই।"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {audienceData.map((a, idx) => (
              <div
                key={a.title}
                className="relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-elegant"
              >
                <div className="absolute -top-4 left-7 grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-accent-foreground font-bold shadow-md">
                  {idx + 1}
                </div>
                <div className="mt-3 grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <a.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  export default AudienceSection