const BASE_URL = "https://moodmate-backend-vklt.onrender.com/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("moodmate_token") : null;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "An error occurred";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  auth: {
    login: (body: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    register: (body: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    googleLogin: (token: string) => request<any>("/auth/google", { method: "POST", body: JSON.stringify({ token }) }),
    forgotPassword: (email: string) => request<any>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (body: any) => request<any>("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  },
  mood: {
    analyze: (text: string) => request<any>("/mood/analyze", { method: "POST", body: JSON.stringify({ text }) }),
    history: () => request<any[]>("/mood/history", { method: "GET" }),
    weekly: () => request<any[]>("/mood/analytics/weekly", { method: "GET" }),
  },
  journal: {
    list: (drafts?: boolean) => {
      const query = drafts !== undefined ? `?drafts=${drafts}` : "";
      return request<any[]>(`/journal${query}`, { method: "GET" });
    },
    get: (id: number) => request<any>(`/journal/${id}`, { method: "GET" }),
    create: (body: any) => request<any>("/journal", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: any) => request<any>(`/journal/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: number) => request<any>(`/journal/${id}`, { method: "DELETE" }),
  },
  chat: {
    send: (message: string) => request<any>("/chat", { method: "POST", body: JSON.stringify({ message }) }),
    history: () => request<any[]>("/chat/history", { method: "GET" }),
  },
  games: {
    saveScore: (gameName: string, score: number) => request<any>("/games/score", { method: "POST", body: JSON.stringify({ gameName, score }) }),
    leaderboard: (gameName: string) => request<any[]>(`/games/leaderboard/${gameName}`, { method: "GET" }),
    myScores: () => request<any[]>("/games/my-scores", { method: "GET" }),
  },
  music: {
    byMood: (mood: string) => request<any[]>(`/music/mood/${mood}`, { method: "GET" }),
    byCategory: (cat: string) => request<any[]>(`/music/category/${cat}`, { method: "GET" }),
    all: () => request<any[]>("/music/all", { method: "GET" }),
  },
  stories: {
    byMood: (mood: string) => request<any[]>(`/stories/mood/${mood}`, { method: "GET" }),
    byCategory: (cat: string) => request<any[]>(`/stories/category/${cat}`, { method: "GET" }),
    get: (id: number) => request<any>(`/stories/${id}`, { method: "GET" }),
    all: () => request<any[]>("/stories/all", { method: "GET" }),
  },
  exercises: {
    all: () => request<any[]>("/exercises", { method: "GET" }),
    byCategory: (cat: string) => request<any[]>(`/exercises/category/${cat}`, { method: "GET" }),
  },
  admin: {
    stats: () => request<any>("/admin/stats", { method: "GET" }),
    users: () => request<any[]>("/admin/users", { method: "GET" }),
    deleteUser: (id: number) => request<any>(`/admin/users/${id}`, { method: "DELETE" }),
    
    // Music Library CRUD
    addMusic: (body: any) => request<any>("/admin/music", { method: "POST", body: JSON.stringify(body) }),
    updateMusic: (id: number, body: any) => request<any>(`/admin/music/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteMusic: (id: number) => request<any>(`/admin/music/${id}`, { method: "DELETE" }),
    
    // Stories CRUD
    addStory: (body: any) => request<any>("/admin/stories", { method: "POST", body: JSON.stringify(body) }),
    updateStory: (id: number, body: any) => request<any>(`/admin/stories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteStory: (id: number) => request<any>(`/admin/stories/${id}`, { method: "DELETE" }),
    
    // Exercises CRUD
    addExercise: (body: any) => request<any>("/admin/exercises", { method: "POST", body: JSON.stringify(body) }),
    updateExercise: (id: number, body: any) => request<any>(`/admin/exercises/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteExercise: (id: number) => request<any>(`/admin/exercises/${id}`, { method: "DELETE" }),
  },
};
