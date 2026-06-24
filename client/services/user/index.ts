// আপনার ব্যাকএন্ডের বেস ইউআরএল (প্রজেক্টের এভায়রনমেন্ট ভ্যারিয়েবল থেকে নিতে পারেন)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * নতুন ইউজার রেজিস্ট্রেশন করার ফাংশন
 */
const registerUser = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।" };
  }
};

/**
 * ইউজারের লগইন হ্যান্ডেল করার ফাংশন
 */
const loginUser = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "লগইন করতে সমস্যা হয়েছে।" };
  }
};

// অবজেক্ট আকারে এক্সপোর্ট করা যেন `UserService.registerUser(data)` এভাবে কল করা যায়
export const UserService = {
  registerUser,
  loginUser,
};