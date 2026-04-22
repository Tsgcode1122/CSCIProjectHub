const API_BASE = "https://csciprojecthub.etsu.edu/api";
const STORAGE_KEY = "capstone_admin_session";

export async function authFetch(endpoint, options = {}) {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  const session = raw ? JSON.parse(raw) : null;
  const token = session?.access_token;

  // Set up headers
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Execute the fetch
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // AUTO-REDIRECT LOGIC
  if (response.status === 401) {
    // 1. Clear the stale session
    sessionStorage.removeItem(STORAGE_KEY);

    // 2. Capture the current URL so we can return later
    const currentPath = window.location.pathname + window.location.search;

    // 3. Force redirect to login
    window.location.href = `/admin/login?next=${encodeURIComponent(currentPath)}`;

    // Return a pending promise that never resolves to stop the component logic
    return new Promise(() => {});
  }

  return response;
}
