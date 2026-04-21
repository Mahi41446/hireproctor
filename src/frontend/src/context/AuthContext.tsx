import { useActor } from "@caffeineai/core-infrastructure";
import { createContext, useCallback, useEffect, useState } from "react";
import { createActor } from "../backend";
import type { UserPublic, backendInterface } from "../backend";
import type { AuthContextType, AuthUser } from "../types";

const SESSION_KEY = "hiring_session_token";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const typedActor = rawActor as backendInterface | null;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount / when actor becomes ready
  useEffect(() => {
    if (isFetching || !typedActor) return;

    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    typedActor
      .getCurrentUser(stored)
      .then((userPublic) => {
        if (userPublic) {
          const role = userPublic.role === "admin" ? "admin" : "candidate";
          setUser({ userId: userPublic.id, role, sessionToken: stored });
          setProfile(userPublic);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
      })
      .finally(() => setIsLoading(false));
  }, [typedActor, isFetching]);

  const login = useCallback(
    (token: string, userId: bigint, role: "admin" | "candidate") => {
      localStorage.setItem(SESSION_KEY, token);
      setUser({ userId, role, sessionToken: token });
      if (typedActor) {
        typedActor.getCurrentUser(token).then((p) => {
          if (p) setProfile(p);
        });
      }
    },
    [typedActor],
  );

  const logout = useCallback(async () => {
    if (typedActor && user?.sessionToken) {
      try {
        await typedActor.logout(user.sessionToken);
      } catch {
        // ignore errors on logout
      }
    }
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setProfile(null);
  }, [typedActor, user]);

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, isAdmin, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
