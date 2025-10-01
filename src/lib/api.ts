const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://make-my-knot-production.up.railway.app/api';

interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  user?: T;
  token?: string;
}

class ApiService {
  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('makemyknot_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    phoneNumber?: string;
    agreeToTerms: boolean;
  }): Promise<ApiResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token if registration successful
    if (response.status === 'success' && response.token) {
      localStorage.setItem('makemyknot_token', response.token);
      localStorage.setItem('makemyknot_user', JSON.stringify(response.user));
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token if login successful
    if (response.status === 'success' && response.token) {
      localStorage.setItem('makemyknot_token', response.token);
      localStorage.setItem('makemyknot_user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem('makemyknot_token');
      localStorage.removeItem('makemyknot_user');
    }
  }

  async getMe(): Promise<ApiResponse> {
    return this.request('/auth/me');
  }

  async updateProfile(updates: any): Promise<ApiResponse> {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, passwordData: {
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request(`/auth/verify-email/${token}`);
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse> {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User methods
  async getUsers(filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/users${params ? `?${params}` : ''}`);
  }

  async getUserById(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, updates: any): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async uploadProfileImage(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.request('/users/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('makemyknot_token')}`,
      },
    });
  }

  // Matching methods
  async getMatches(): Promise<ApiResponse> {
    return this.request('/matches');
  }

  async getPotentialMatches(): Promise<ApiResponse> {
    return this.request('/matches/potential');
  }

  async likeUser(userId: string): Promise<ApiResponse> {
    return this.request('/matches/like', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async passUser(userId: string): Promise<ApiResponse> {
    return this.request('/matches/pass', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async blockUser(userId: string, reason?: string): Promise<ApiResponse> {
    return this.request('/matches/block', {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
  }

  // Chat methods
  async getConversations(): Promise<ApiResponse> {
    return this.request('/chats');
  }

  async getConversation(conversationId: string): Promise<ApiResponse> {
    return this.request(`/chats/${conversationId}`);
  }

  async sendMessage(conversationId: string, message: {
    content: string;
    messageType?: string;
  }): Promise<ApiResponse> {
    return this.request(`/chats/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async markMessageAsRead(conversationId: string, messageId: string): Promise<ApiResponse> {
    return this.request(`/chats/${conversationId}/messages/${messageId}/read`, {
      method: 'PATCH',
    });
  }

  // Lead methods
  async submitLead(leadData: {
    name: string;
    email: string;
    phone: string;
    answers: Record<string, any>;
  }): Promise<ApiResponse> {
    return this.request('/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
  }

  // Questionnaire methods
  async saveQuestionnaireResponse(questionnaireData: {
    responses: Record<string, any>;
    compatibilityProfile: any;
    completionTime?: number;
    questionnaire?: any;
    metadata?: any;
  }): Promise<ApiResponse> {
    return this.request('/questionnaires', {
      method: 'POST',
      body: JSON.stringify(questionnaireData),
    });
  }

  async getUserQuestionnaireResponse(): Promise<ApiResponse> {
    return this.request('/questionnaires/me');
  }

  async getCompatibilityMatches(minCompatibility = 70, limit = 10): Promise<ApiResponse> {
    return this.request(`/questionnaires/matches?minCompatibility=${minCompatibility}&limit=${limit}`);
  }

  async calculateCompatibility(userId: string): Promise<ApiResponse> {
    return this.request(`/questionnaires/compatibility/${userId}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
