import { ReactNode } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps } from "@/types";

interface UserRole {
  role: string;
}

type AuthUser = PageProps["auth"]["user"] & {
  roles?: UserRole[];
};

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const useAuth = (): AuthState => {
  const { auth } = usePage<PageProps>().props;
  const user = (auth?.user as AuthUser | null) ?? null;
  const roles = user?.roles?.map((item) => item.role) ?? [];
  const userRole = roles[0] ?? null;

  return {
    user,
    loading: false,
    isAdmin: roles.includes("admin"),
    isModerator:
      roles.includes("moderator") ||
      roles.includes("messages_moderator") ||
      roles.includes("operations_manager"),
    signIn: async () => ({ error: new Error("Use Inertia useForm in Login page") }),
    signOut: async () => {
      router.post("/logout");
    },
    userRole,
  };
};
