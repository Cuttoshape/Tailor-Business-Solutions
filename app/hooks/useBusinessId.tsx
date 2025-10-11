import { useState, useEffect } from "react";

export function useBusinessId() {
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw) as { businessId?: string };
        if (user?.businessId) {
          setBusinessId(user.businessId);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);

  return businessId;
}
