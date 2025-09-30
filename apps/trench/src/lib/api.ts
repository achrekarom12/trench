const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/auth/me");
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
}

export const apiClient = new ApiClient(API_BASE_URL);
