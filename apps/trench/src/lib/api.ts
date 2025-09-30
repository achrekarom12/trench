const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage for authenticated requests
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    const config: RequestInit = {
      headers: {
        // Only set Content-Type if not explicitly overridden and if there's a body
        ...(options.body && !(options.headers as Record<string, string>)?.["Content-Type"] && { "Content-Type": "application/json" }),
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async signup(name: string, email: string, password: string, role: string = "STUDENT") {
    return this.request("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    return this.request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });
  }

  async logout() {
    return this.request("/api/v1/auth/logout", {
      method: "POST",
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/api/v1/auth/me");
  }

  // Course endpoints
  async getCourses() {
    return this.request("/courses");
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request("/assignments");
  }

  async getAssignment(id: string) {
    return this.request(`/assignments/${id}`);
  }

  async submitAssignment(assignmentId: string, submission: Record<string, unknown>) {
    return this.request(`/assignments/${assignmentId}/submit`, {
      method: "POST",
      body: JSON.stringify(submission),
    });
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request("/api/v1/admins/stats");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
