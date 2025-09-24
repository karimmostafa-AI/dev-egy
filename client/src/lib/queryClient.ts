import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get the appropriate token based on the URL
  let token: string | null = null;
  if (url.includes('/api/admin/')) {
    token = localStorage.getItem("admin_token");
  } else {
    token = localStorage.getItem("token");
  }
  
  // Get session ID from localStorage for cart persistence
  const sessionId = localStorage.getItem("session_id");
  
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Include session ID if available (for cart persistence)
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Store session ID from response header if provided
  const responseSessionId = res.headers.get("x-session-id");
  if (responseSessionId) {
    localStorage.setItem("session_id", responseSessionId);
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get session ID from localStorage for cart persistence
    const sessionId = localStorage.getItem("session_id");
    
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }
    
    const res = await fetch(queryKey.join("/") as string, {
      headers,
      credentials: "include",
    });

    // Store session ID from response header if provided
    const responseSessionId = res.headers.get("x-session-id");
    if (responseSessionId) {
      localStorage.setItem("session_id", responseSessionId);
    }

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
