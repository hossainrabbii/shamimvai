// Simple localStorage-backed enrollment store with cross-tab sync.
export type PaymentStatus = "pending" | "approved";

export interface Enrollment {
  id: string;
  name: string;
  phone: string;
  password: string;
  facebook: string;
  senderNumber: string;
  trxId: string;
  amount: number;
  submittedAt: string;
  status: PaymentStatus;
}

const KEY = "tarikvai_enrollments_v1";
const EVT = "tarikvai:enrollments-changed";

export function listEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(items: Enrollment[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function addEnrollment(e: Omit<Enrollment, "id" | "submittedAt" | "status">): Enrollment {
  const item: Enrollment = {
    ...e,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "pending",
  };
  save([item, ...listEnrollments()]);
  return item;
}

export function approveEnrollment(id: string) {
  save(listEnrollments().map((e) => (e.id === id ? { ...e, status: "approved" } : e)));
}

export function deleteEnrollment(id: string) {
  save(listEnrollments().filter((e) => e.id !== id));
}

export function subscribe(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVT, handler);
    window.removeEventListener("storage", handler);
  };
}
