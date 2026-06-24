import { GraduationCap } from "lucide-react";
import Link from "next/link";


function Footer() {
    return (
      <footer className="border-t border-border bg-card py-10">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>© {new Date().getFullYear()} Shamim Vai জব প্রস্তুতি একাডেমি</span>
          </div>
          <Link href="/admin" className="hover:text-foreground">অ্যাডমিন ড্যাশবোর্ড</Link>
        </div>
      </footer>
    );
  }


  export default Footer