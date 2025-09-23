// Comprehensive Admin API Client
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class AdminApiClient {
  private baseUrl: string = '/api/admin';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'An error occurred',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Dashboard Analytics
  async getDashboardAnalytics() {
    return this.request<any>('/dashboard/analytics');
  }

  // Orders Management
  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request<PaginatedResponse<any>>(`/orders?${queryParams}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getOrder(orderId: string) {
    return this.request(`/orders/${orderId}`);
  }

  // Products Management
  async getProducts(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request<PaginatedResponse<any>>(`/products?${queryParams}`);
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId: string, productData: any) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId: string) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Categories Management
  async getCategories(params: { page?: number; limit?: number } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request(`/categories?${queryParams}`);
  }

  async getCategory(categoryId: string) {
    return this.request(`/categories/${categoryId}`);
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(categoryId: string, categoryData: any) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId: string) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Customers Management
  async getCustomers(params: { page?: number; limit?: number } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request<PaginatedResponse<any>>(`/customers?${queryParams}`);
  }

  async getCustomer(customerId: string) {
    return this.request(`/customers/${customerId}`);
  }

  async updateCustomer(customerId: string, customerData: any) {
    return this.request(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(customerId: string) {
    return this.request(`/customers/${customerId}`, {
      method: 'DELETE',
    });
  }

  // Coupons Management
  async getCoupons(params: { page?: number; limit?: number } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request<PaginatedResponse<any>>(`/coupons?${queryParams}`);
  }

  async getCoupon(couponId: string) {
    return this.request(`/coupons/${couponId}`);
  }

  async createCoupon(couponData: any) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  }

  async updateCoupon(couponId: string, couponData: any) {
    return this.request(`/coupons/${couponId}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    });
  }

  async deleteCoupon(couponId: string) {
    return this.request(`/coupons/${couponId}`, {
      method: 'DELETE',
    });
  }

  // Reviews Management
  async getReviews(params: {
    page?: number;
    limit?: number;
    productId?: string;
    isApproved?: boolean;
  } = {}) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.request<PaginatedResponse<any>>(`/reviews?${queryParams}`);
  }

  async approveReview(reviewId: string, isApproved: boolean) {
    return this.request(`/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  }

  // File Upload
  async uploadFile(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('admin_token');
      const xhr = new XMLHttpRequest();

      return new Promise<ApiResponse<{ url: string; originalName: string; size: number }>>(
        (resolve, reject) => {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
              const progress = (event.loaded / event.total) * 100;
              onProgress(progress);
            }
          };

          xhr.onload = () => {
            try {
              const response = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(response);
              } else {
                resolve({
                  success: false,
                  error: response.error || 'Upload failed',
                });
              }
            } catch (error) {
              resolve({
                success: false,
                error: 'Failed to parse response',
              });
            }
          };

          xhr.onerror = () => {
            resolve({
              success: false,
              error: 'Network error during upload',
            });
          };

          xhr.open('POST', `${this.baseUrl}/upload`);
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          xhr.send(formData);
        }
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Bulk Operations
  async bulkDeleteProducts(productIds: string[]) {
    return this.request('/products/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: productIds }),
    });
  }

  async bulkUpdateProductStatus(productIds: string[], isAvailable: boolean) {
    return this.request('/products/bulk-status', {
      method: 'PATCH',
      body: JSON.stringify({ ids: productIds, isAvailable }),
    });
  }

  async exportData(type: 'products' | 'orders' | 'customers', format: 'csv' | 'xlsx' = 'csv') {
    const response = await fetch(`${this.baseUrl}/export/${type}?format=${format}`, {
      headers: this.getAuthHeaders(),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error: error.message || 'Export failed' };
    }
  }
}

export const adminApi = new AdminApiClient();
export default adminApi;