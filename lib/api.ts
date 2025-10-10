import { BannerData } from "@/components/BusinessBanner";
import { Customer } from "@/components/CustomerLookup";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

class APIClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // ---------- Helpers ----------
  private authHeader(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...this.authHeader(),
      ...(options.headers as Record<string, string>),
      // Only set JSON content-type if not sending FormData
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to surface server error message; fall back to status text
      let message = response.statusText || "An error occurred";
      try {
        const err = await response.json();
        if (typeof err?.error === "string") message = err.error;
        if (typeof err?.message === "string") message = err.message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    // If server returns 204 No Content
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const body =
      data instanceof FormData
        ? data
        : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return this.request<T>(endpoint, {
      method: "POST",
      body,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const body =
      data instanceof FormData
        ? data
        : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return this.request<T>(endpoint, {
      method: "PUT",
      body,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const body =
      data instanceof FormData
        ? data
        : data !== undefined
        ? JSON.stringify(data)
        : undefined;

    return this.request<T>(endpoint, {
      method: "PATCH",
      body,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // ---------- Banners ----------
  banners = {
    create: (data: unknown) => this.post("/banners", data),
    get: (businessId: string) => this.get<BannerData>(`/banners/${businessId}`),
    update: (businessId: string, data: unknown) =>
      this.put(`/banners/${businessId}`, data),
    delete: (businessId: string) => this.delete(`/banners/${businessId}`),
  };

  // ---------- Auth ----------
  auth = {
    register: (data: unknown) => this.post("/auth/register", data),
    login: (data: unknown) => this.post("/auth/login", data),
  };

  // ---------- Customers ----------
  private toCustomer(u: unknown): Customer {
    const o = u as Record<string, unknown>;

    const id =
      typeof o?.id === "string" || typeof o?.id === "number"
        ? (o.id as string | number)
        : undefined;
    const name = typeof o?.name === "string" ? o.name.trim() : "";

    if (!id || !name) throw new Error("Invalid customer: missing id or name.");

    const phone =
      typeof o?.phone === "string" && o.phone.trim()
        ? o.phone.trim()
        : undefined;
    const email =
      typeof o?.email === "string" && o.email.trim()
        ? o.email.trim()
        : undefined;
    const avatar =
      typeof o?.avatar === "string" && o.avatar.trim()
        ? o.avatar.trim()
        : undefined;

    return { id, name, phone, email, avatar };
  }

  private toCustomersResponse(u: unknown): { customers: Customer[] } {
    const o = u as Record<string, unknown>;
    const arr = Array.isArray(o?.customers) ? (o.customers as unknown[]) : null;
    if (!arr)
      throw new Error("Invalid response: `customers` must be an array.");
    return { customers: arr.map((x) => this.toCustomer(x)) };
  }

  customers = {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/customers${query}`);
    },

    getMyCustomer: async (): Promise<{ customers: Customer[] }> => {
      // this.get returns parsed JSON already
      const data = await this.get<unknown>(`/customers/my`);
      return this.toCustomersResponse(data);
    },

    getOne: (id: string) => this.get(`/customers/${id}`),
    create: (data: unknown) => this.post("/customers", data),
    update: (id: string, data: unknown) => this.put(`/customers/${id}`, data),
    delete: (id: string) => this.delete(`/customers/${id}`),
    getStats: () => this.get("/customers/stats"),
  };

  // ---------- Orders ----------
  orders = {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/orders${query}`);
    },
    getOne: (id: string) => this.get(`/orders/${id}`),
    getStats: () => this.get("/orders/stats"),
    create: (data: unknown) => this.post("/orders", data),
    update: (id: string, data: unknown) => this.put(`/orders/${id}`, data),
    delete: (id: string) => this.delete(`/orders/${id}`),
  };

  // ---------- Measurements ----------
  measurements = {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/measurements${query}`);
    },
    getOne: (id: string) => this.get(`/measurements/${id}`),
    create: (data: unknown) => this.post("/measurements", data),
    update: (id: string, data: unknown) =>
      this.put(`/measurements/${id}`, data),
    delete: (id: string) => this.delete(`/measurements/${id}`),
  };

  // ---------- Invoices ----------
  invoices = {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/invoices${query}`);
    },
    getOne: (id: string) => this.get(`/invoices/${id}`),
    create: (data: unknown) => this.post("/invoices", data),
    update: (id: string, data: unknown) => this.put(`/invoices/${id}`, data),
    generatePDF: (id: string) => this.post(`/invoices/${id}/generate-pdf`),
    sendEmail: (id: string) => this.post(`/invoices/${id}/send-email`),
    delete: (id: string) => this.delete(`/invoices/${id}`),
  };

  // ---------- Products ----------
  products = {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/products${query}`);
    },

    getMyAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/products/my${query}`);
    },

    getOne: (id: string) => this.get(`/products/${id}`),
    getCategories: () => this.get("/products/categories"),
    create: (data: unknown) => {
      return this.post("/products", data);
    },
    update: (id: string, data: unknown) => this.put(`/products/${id}`, data),
    delete: (id: string) => this.delete(`/products/${id}`),
  };

  // ---------- Analytics ----------
  analytics = {
    getDashboard: () => this.get("/analytics/dashboard"),
    getRevenue: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/analytics/revenue${query}`);
    },
    getTopProducts: (limit?: number) => {
      const query = limit ? `?limit=${limit}` : "";
      return this.get(`/analytics/top-products${query}`);
    },
    getTopCustomers: (limit?: number) => {
      const query = limit ? `?limit=${limit}` : "";
      return this.get(`/analytics/top-customers${query}`);
    },
    getCustomerInsights: () => this.get("/analytics/customer-insights"),
    getOrderTrends: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/analytics/order-trends${query}`);
    },
  };
}

export const apiClient = new APIClient();
export default apiClient;
