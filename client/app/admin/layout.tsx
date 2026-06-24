import { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাডমিন ড্যাশবোর্ড — Shamim Vai",
};

export default function StudentLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}