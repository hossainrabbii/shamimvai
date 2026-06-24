import { ArrowRight, GraduationCap, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

function NavBar({ onEnroll }: { onEnroll: () => void }) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-foreground">Shamim Vai</p>
              <p className="text-xs text-muted-foreground">জব প্রস্তুতি একাডেমি</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              অ্যাডমিন
            </Link>
            <Link href="/student-login">
              <Button variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                <LogIn className="h-4 w-4" /> লগইন
              </Button>
            </Link>
            <Button onClick={onEnroll} className="bg-gradient-primary shadow-md hover:opacity-95">
              ভর্তি হোন <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    );
  }


  export default NavBar