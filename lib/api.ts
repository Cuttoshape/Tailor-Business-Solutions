const API_BASE_URL =
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "An error occurred");
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  auth = {
    register: (data: any) => this.post("/auth/register", data),
    login: (data: any) => this.post("/auth/login", data),
  };

  customers = {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/customers${query}`);
    },
    getOne: (id: string) => this.get(`/customers/${id}`),
    create: (data: any) => this.post("/customers", data),
    update: (id: string, data: any) => this.put(`/customers/${id}`, data),
    delete: (id: string) => this.delete(`/customers/${id}`),
    getStats: () => this.get("/customers/stats"),
  };

  orders = {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/orders${query}`);
    },
    getOne: (id: string) => this.get(`/orders/${id}`),
    getStats: () => this.get("/orders/stats"),
    create: (data: any) => this.post("/orders", data),
    update: (id: string, data: any) => this.put(`/orders/${id}`, data),
    delete: (id: string) => this.delete(`/orders/${id}`),
  };

  measurements = {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/measurements${query}`);
    },
    getOne: (id: string) => this.get(`/measurements/${id}`),
    create: (data: any) => this.post("/measurements", data),
    update: (id: string, data: any) => this.put(`/measurements/${id}`, data),
    delete: (id: string) => this.delete(`/measurements/${id}`),
  };

  invoices = {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/invoices${query}`);
    },
    getOne: (id: string) => this.get(`/invoices/${id}`),
    create: (data: any) => this.post("/invoices", data),
    update: (id: string, data: any) => this.put(`/invoices/${id}`, data),
    generatePDF: (id: string) => this.post(`/invoices/${id}/generate-pdf`),
    sendEmail: (id: string) => this.post(`/invoices/${id}/send-email`),
    delete: (id: string) => this.delete(`/invoices/${id}`),
  };

  products = {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/products${query}`);
    },
    getOne: (id: string) => this.get(`/products/${id}`),
    getCategories: () => this.get("/products/categories"),
    create: (data: any) => this.post("/products", data),
    update: (id: string, data: any) => this.put(`/products/${id}`, data),
    delete: (id: string) => this.delete(`/products/${id}`),
  };

  analytics = {
    getDashboard: () => this.get("/analytics/dashboard"),
    getRevenue: (params?: any) => {
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
    getOrderTrends: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return this.get(`/analytics/order-trends${query}`);
    },
  };
}

export const apiClient = new APIClient();
export default apiClient;
