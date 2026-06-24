// ১. এপিআই এর বেইজ ইউআরএল
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ২. টাইপ ডেফিনিশন (Type-Safety)
export interface ILinks {
  liveUrl: string;
  examUrl: string;
  updatedAt?: string;
}

export interface ILinksApiResponse {
  success: boolean;
  message: string;
  data: ILinks;
}

// ৩. লিংক সার্ভিস মেথডসমূহ
const saveLinks = async (data: { liveUrl: string; examUrl: string }): Promise<ILinksApiResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/links/save-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Save Links Error:", error);
    return { 
      success: false, 
      message: "লিংক সেভ করতে সমস্যা হয়েছে।", 
      data: { liveUrl: "", examUrl: "" } 
    };
  }
};

const getLatestLinks = async (): Promise<ILinksApiResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/links/latest`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", 
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server returned error:", errorText);
      return { 
        success: false, 
        message: "সার্ভার থেকে লিংক ডাটা আসেনি।", 
        data: { liveUrl: "", examUrl: "" } 
      };
    }

    return await res.json();
  } catch (error) {
    console.error("Get Latest Links Error:", error);
    return { 
      success: false, 
      message: "লিংক ডাটা আনতে সমস্যা হয়েছে।", 
      data: { liveUrl: "", examUrl: "" } 
    };
  }
};

export const LinksService = {
  saveLinks,
  getLatestLinks,
};