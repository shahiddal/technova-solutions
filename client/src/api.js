import { useEffect, useState } from "react";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Successful responses, kept for the session so going back and forth between pages is instant.
// shortcut: never expires, so content edits show after a page reload; add a TTL once content changes often
const cache = new Map();

// GET `${API_URL}${path}` and return { data } | { loading } | { error, notFound }.
// Pass null to skip the request.
export function useApi(path) {
  const [result, setResult] = useState({ path: null });

  useEffect(() => {
    if (!path || cache.has(path)) return;

    const controller = new AbortController();

    axios
      // The free API host can take ~50 s to wake up
      .get(`${API_URL}${path}`, { signal: controller.signal, timeout: 70000 })
      .then((response) => {
        cache.set(path, response.data.data);
        setResult({ path, data: response.data.data });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) setResult({ path, error });
      });

    return () => controller.abort();
  }, [path]);

  if (!path) return {};
  if (cache.has(path)) return { data: cache.get(path) };
  if (result.path !== path) return { loading: true };

  return {
    error: result.error,
    notFound: result.error?.response?.status === 404,
  };
}

// Admin API: always same-origin (Vercel rewrite in production, Vite proxy locally),
// so the httpOnly session cookie is first-party. Never cached.
export const adminApi = axios.create({ baseURL: "/api/admin", timeout: 70000 });
