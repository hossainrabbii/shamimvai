"use client";

import { Enrollment } from "@/components/AdminDashboard";
import { useState, useMemo, useEffect } from "react";

export function useAdminDashboard(initialEnrollments: Enrollment[] = []) {
  // ১. ডাটাবেজ থেকে আসা ডাটা দিয়ে স্টেট ইনিশিয়ানিলাইজ
  const [items, setItems] = useState<Enrollment[]>(initialEnrollments);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  // ✨ মাস্টার ফিক্স: ডাটাবেজের অবজেক্ট আসামাত্রই স্টেট সিঙ্ক হবে
  useEffect(() => {
    if (Array.isArray(initialEnrollments)) {
      setItems(initialEnrollments);
    }
  }, [initialEnrollments]);

  // ২. রিয়াল-টাইম স্ট্যাটস ক্যালকুলেশন
  const stats = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];
    const pending = safeItems.filter((i) => i.status === "pending").length;
    const approved = safeItems.filter((i) => i.status === "approved").length;
    const revenue = safeItems
      .filter((i) => i.status === "approved")
      .reduce((s, i) => s + (i.courseId?.price || 0), 0);

    return { total: safeItems.length, pending, approved, revenue };
  }, [items]);

  // ৩. ১০০% ফুলপ্রুফ ফিল্টার লজিক
  const filtered = useMemo(() => {
    const safeItems = Array.isArray(items) ? items : [];
    
    return safeItems.filter((item) => {
      // ক) স্ট্যাটাস ফিল্টার ম্যাচিং
      if (filter !== "all" && item.status !== filter) return false;

      // খ) সার্চ কুয়েরি ট্রিম করা
      const searchTxt = (query || "").trim().toLowerCase();
      if (!searchTxt) return true; // সার্চ ফাঁকা থাকলে সব ডাটা পাস

      // গ) সেফ চেইনিং ও ডাটা টাইপ হ্যান্ডলিং
      const sName = item.studentId?.name?.toLowerCase() || "";
      const cName = item.courseId?.name?.toLowerCase() || "";
      const trx = item.transactionId?.toLowerCase() || "";
      const pNum = item.paidNumber || "";

      return (
        sName.includes(searchTxt) ||
        cName.includes(searchTxt) ||
        trx.includes(searchTxt) ||
        pNum.includes(searchTxt)
      );
    });
  }, [items, query, filter]);

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: "approved" } : item))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return {
    query,
    setQuery,
    filter,
    setFilter,
    stats,
    filtered, 
    handleApprove,
    handleDelete,
  };
}