import { Metadata } from "next";

export const metadata: Metadata = {
  title: "শিক্ষার্থী ড্যাশবোর্ড — Shamim Vai",
};

export default function StudentLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}