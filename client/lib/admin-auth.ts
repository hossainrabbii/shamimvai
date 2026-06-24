// Demo admin auth — hardcoded password, sessionStorage gate.
const KEY = "tarikvai_admin_auth_v1";
export const ADMIN_PASSWORD = "tarik123";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}

export function adminLogin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  sessionStorage.setItem(KEY, "1");
  return true;
}

export function adminLogout() {
  sessionStorage.removeItem(KEY);
}
