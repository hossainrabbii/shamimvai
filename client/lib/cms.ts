// Notice board + live/exam links, persisted to localStorage with cross-tab sync.
export interface Notice {
    id: string;
    text: string;
    createdAt: string;
  }
  
  export interface ClassLinks {
    liveUrl: string;
    examUrl: string;
    updatedAt: string;
  }
  
  const NOTICES_KEY = "tarikvai_notices_v1";
  const LINKS_KEY = "tarikvai_class_links_v1";
  const EVT = "tarikvai:cms-changed";
  
  function emit() {
    window.dispatchEvent(new CustomEvent(EVT));
  }
  
  export function listNotices(): Notice[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(NOTICES_KEY) || "[]");
    } catch {
      return [];
    }
  }
  
  export function latestNotice(): Notice | null {
    return listNotices()[0] ?? null;
  }
  
  export function publishNotice(text: string): Notice {
    const item: Notice = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [item, ...listNotices()].slice(0, 50);
    localStorage.setItem(NOTICES_KEY, JSON.stringify(next));
    emit();
    return item;
  }
  
  export function deleteNotice(id: string) {
    localStorage.setItem(
      NOTICES_KEY,
      JSON.stringify(listNotices().filter((n) => n.id !== id)),
    );
    emit();
  }
  
  export function getLinks(): ClassLinks {
    if (typeof window === "undefined") return { liveUrl: "", examUrl: "", updatedAt: "" };
    try {
      return (
        JSON.parse(localStorage.getItem(LINKS_KEY) || "null") ?? {
          liveUrl: "",
          examUrl: "",
          updatedAt: "",
        }
      );
    } catch {
      return { liveUrl: "", examUrl: "", updatedAt: "" };
    }
  }
  
  export function saveLinks(liveUrl: string, examUrl: string): ClassLinks {
    const item: ClassLinks = {
      liveUrl: liveUrl.trim(),
      examUrl: examUrl.trim(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LINKS_KEY, JSON.stringify(item));
    emit();
    return item;
  }
  
  export function subscribeCms(cb: () => void): () => void {
    const h = () => cb();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }
  