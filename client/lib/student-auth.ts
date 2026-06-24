// // Student login by phone/email + password. The `phone` field in enrollments
// // holds either a mobile number or an email address (registration accepts both).
// import { listEnrollments, type Enrollment } from "./enrollments";

// const KEY = "tarikvai_student_phone_v1";

// export function findByIdentifier(identifier: string): Enrollment | null {
//   const id = identifier.trim().toLowerCase();
//   if (!id) return null;
//   return (
//     listEnrollments().find((e:any) => (e.phone ?? "").trim().toLowerCase() === id) ?? null
//   );
// }

// // Backwards-compatible alias.
// export const findByPhone = findByIdentifier;

// export function studentLogin(identifier: string, password: string): Enrollment | null {
//   const found = findByIdentifier(identifier);
//   if (!found) return null;
//   if ((found.password ?? "") !== password) return null;
  
//   // Next.js client-side safety guard
//   if (typeof window !== "undefined") {
//     sessionStorage.setItem(KEY, found.phone ?? "");
//   }
  
//   return found;
// }

// export function currentStudent(): Enrollment | null {
//   // SSR সেফটি চেক: সার্ভার রেন্ডারিংয়ের সময় সেশন রিড করা স্কিপ করবে
//   if (typeof window === "undefined") return null;
  
//   const id = sessionStorage.getItem(KEY);
//   if (!id) return null;
//   return findByIdentifier(id);
// }

// export function studentLogout() {
//   // Next.js client-side safety guard
//   if (typeof window !== "undefined") {
//     sessionStorage.removeItem(KEY);
//   }
// }