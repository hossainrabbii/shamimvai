const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ১. স্টুডেন্টের কোর্স এনরোলমেন্ট রিকোয়েস্ট পাঠানো
const enrollInCourse = async (data: { studentId: string; courseId: string; paidNumber: string; transactionId: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "পেমেন্ট সাবমিট করতে সমস্যা হয়েছে।" };
  }
};

// ২. স্টুডেন্টের নিজের এনরোলমেন্ট হিস্ট্রি আনা
const getMyEnrollments = async (studentId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/student/${studentId}`, { method: "GET" });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "এনরোলমেন্ট ডাটা আনতে সমস্যা হয়েছে।" };
  }
};

// services/enrollment.ts (বা যেখানেই এই সার্ভিস ফাইল আছে)

const getAllEnrollmentsForAdmin = async () => {
  try {
    // ⚠️ আপনার BASE_URL এবং এপিআই এন্ডপয়েন্টটি ১০০% ঠিক আছে কিনা চেক করুন
    // যেমন: ব্যাকএন্ড যদি পোর্টে চলে ৫০০০, তবে http://localhost:5000/api/v1/enrollments
    const res = await fetch(`${BASE_URL}/enrollments`, { 
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    // রেসপন্স যদি ওয়ান টাইম ওয়ান (ওকে) না হয়, তবে টেক্সট বা এরর প্রিন্ট করবে
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server returned HTML or error instead of JSON:", errorText);
      return { success: false, message: "সার্ভার থেকে সঠিক ডাটা আসেনি।" };
    }

    // 🚀 এখানে await দিতেই হবে, নাহলে pending দেখাবে!
    const data = await res.json(); 
    return data;
  } catch (error) {
    console.error("Fetch implementation error:", error);
    return { success: false, message: "অ্যাডমিন প্যানেলের ডাটা আনতে সমস্যা হয়েছে।" };
  }
};

// ৪. অ্যাডমিন কর্তৃক পেমেন্ট স্ট্যাটাস আপডেট করা (Approve/Reject)
const updateEnrollmentStatus = async (id: string, status: "approved" | "rejected") => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/update-status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।" };
  }
};

// ৫. এনরোলমেন্ট রিকোয়েস্ট ডিলিট করা
const deleteEnrollment = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/enrollments/${id}`, { method: "DELETE" });
    return await res.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "এনরোলমেন্ট রিকোয়েস্টটি মুছতে সমস্যা হয়েছে।" };
  }
};

export const EnrollmentService = {
  enrollInCourse,
  getMyEnrollments,
  getAllEnrollmentsForAdmin, 
  updateEnrollmentStatus,    
  deleteEnrollment,          
};