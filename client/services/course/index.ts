const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * ১. নতুন কোর্স তৈরি করা (Create)
 */
const createCourse = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/create-course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Create Course Error:", error);
    return { success: false, message: "কোর্স তৈরি করতে সমস্যা হয়েছে।" };
  }
};

/**
 * ২. সব কোর্সের তালিকা আনা (Read - All)
 */
const getAllCourses = async () => {
  try {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Get All Courses Error:", error);
    return { success: false, message: "কোর্স তালিকা আনতে সমস্যা হয়েছে।" };
  }
};

/**
 * ৩. নির্দিষ্ট একটি কোর্সের তথ্য আনা (Read - Single)
 */
const getSingleCourse = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Get Single Course Error:", error);
    return { success: false, message: "কোর্সের তথ্য আনতে সমস্যা হয়েছে।" };
  }
};

/**
 * ৪. কোর্সের তথ্য আপডেট করা (Update)
 */
const updateCourse = async (id: string, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Update Course Error:", error);
    return { success: false, message: "কোর্স আপডেট করতে সমস্যা হয়েছে।" };
  }
};

/**
 * ৫. কোর্স মুছে ফেলা (Delete)
 */
const deleteCourse = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Delete Course Error:", error);
    return { success: false, message: "কোর্সটি মুছতে সমস্যা হয়েছে।" };
  }
};

// অবজেক্ট আকারে এক্সপোর্ট যেন সহজে ইম্পোর্ট করে ব্যবহার করা যায়
export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};