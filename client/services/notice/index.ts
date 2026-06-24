// ১. এপিআই এর বেইজ ইউআরএল (আপনার কনফিগারেশন অনুযায়ী)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ২. টাইপ ডেফিনিশন (Type-Safety এর জন্য)
export interface INotice {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface INoticeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ৩. নোটিশ সার্ভিস অবজেক্ট ইমপ্লিমেন্টেশন (CRUD)
const createNotice = async (data: { title: string; content: string }): Promise<INoticeApiResponse<INotice>> => {
  try {
    const res = await fetch(`${BASE_URL}/notices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Create Notice Error:", error);
    return { success: false, message: "নতুন নোটিশ তৈরি করতে সমস্যা হয়েছে।", data: {} as INotice };
  }
};

const getAllNotices = async (): Promise<INoticeApiResponse<INotice[]>> => {
  try {
    const res = await fetch(`${BASE_URL}/notices`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // রিয়েল-টাইম ডাটার জন্য ক্যাশ ডিজেবল রাখা ভালো
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server returned error instead of JSON:", errorText);
      return { success: false, message: "সার্ভার থেকে সঠিক ডাটা আসেনি।", data: [] };
    }

    return await res.json();
  } catch (error) {
    console.error("Get All Notices Error:", error);
    return { success: false, message: "নোটিশ ডাটা আনতে সমস্যা হয়েছে।", data: [] };
  }
};

const getSingleNotice = async (id: string): Promise<INoticeApiResponse<INotice>> => {
  try {
    const res = await fetch(`${BASE_URL}/notices/${id}`, { method: "GET" });
    return await res.json();
  } catch (error) {
    console.error("Get Single Notice Error:", error);
    return { success: false, message: "নির্দিষ্ট নোটিশটি আনতে সমস্যা হয়েছে।", data: {} as INotice };
  }
};

const updateNotice = async (id: string, data: { title?: string; content?: string }): Promise<INoticeApiResponse<INotice>> => {
  try {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Update Notice Error:", error);
    return { success: false, message: "নোটিশ আপডেট করতে সমস্যা হয়েছে।", data: {} as INotice };
  }
};

const deleteNotice = async (id: string): Promise<INoticeApiResponse<INotice>> => {
  try {
    const res = await fetch(`${BASE_URL}/notices/${id}`, { method: "DELETE" });
    return await res.json();
  } catch (error) {
    console.error("Delete Notice Error:", error);
    return { success: false, message: "নোটিশটি মুছতে সমস্যা হয়েছে।", data: {} as INotice };
  }
};

export const NoticeService = {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
};