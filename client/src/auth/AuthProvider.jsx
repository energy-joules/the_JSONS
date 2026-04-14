import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, clearToken, getToken, setToken } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await apiFetch("/auth/me");
        if (!cancelled) setUser(data.user);
      } catch {
        clearToken();
        if (!cancelled) {
          setTokenState(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,
      async login({ email, password }) {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        return data.user;
      },
      async signup(payload) {
        const data = await apiFetch("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        clearToken();
        setTokenState(null);
        setUser(null);
      },
    };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

