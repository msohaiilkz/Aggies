import { createContext, ReactNode, useContext, useState } from "react";

type User = {
  email: string;
  role: "BUSINESS_HEAD" | "ANALYST" | "SUPER_EXECUTIVE";
  username?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const dummyUsers = [
  { email: "exec@example.com", password: "password123", role: "BUSINESS_HEAD" },
  { email: "analyst@example.com", password: "password123", role: "ANALYST" },
  {
    email: "super@example.com",
    password: "password123",
    role: "SUPER_EXECUTIVE",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("sentient_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string) => {
    const foundUser = dummyUsers.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password.trim(),
    );
    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        role: foundUser.role as "BUSINESS_HEAD" | "ANALYST" | "SUPER_EXECUTIVE",
        username: foundUser.email.split("@")[0],
      };
      setUser(userData);
      localStorage.setItem("sentient_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sentient_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
